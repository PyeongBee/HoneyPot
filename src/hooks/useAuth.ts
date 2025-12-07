"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/authStore";
import { OAuthProvider } from "@/types/auth";
import { normalizeInternalPath } from "@/utils/url";

/**
 * 인증 관리 Hook
 * - 클라이언트에서 인증 상태를 관리하고 OAuth 로그인을 처리합니다.
 */
export function useAuth() {
  const { user, isLoading, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const prevAuthenticated = useRef<boolean>(
    useAuthStore.getState().isAuthenticated
  );
  const prompted = useRef<boolean>(false);

  // 초기 세션 로드 및 상태 구독
  useEffect(() => {
    const supabase = createClient();
    const { setUser, setLoading } = useAuthStore.getState();

    const initializeAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    void initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 탭 포커스/가시성 변경 시 세션 동기화로 UI 최신화
  useEffect(() => {
    const supabase = createClient();
    const { setUser } = useAuthStore.getState();

    let syncing = false;
    const askRelogin = async (): Promise<boolean> => {
      const anyWindow: any = window as any;
      const customConfirm = anyWindow?.__waggleConfirm;
      if (typeof customConfirm === "function") {
        try {
          const result = await customConfirm({
            title: "세션이 만료되었습니다.",
            message: "다시 로그인하시겠습니까?",
            confirmText: "로그인",
            cancelText: "취소",
          });
          return !!result;
        } catch {
          // fallback below
        }
      }
      return window.confirm("세션이 만료되었습니다. 다시 로그인하시겠습니까?");
    };

    const sync = async () => {
      if (syncing) return;
      syncing = true;
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        const newAuthenticated = !!session?.user;
        setUser(session?.user ?? null);

        if (
          prevAuthenticated.current &&
          !newAuthenticated &&
          !prompted.current
        ) {
          prompted.current = true;
          const shouldLogin = await askRelogin();
          if (shouldLogin) {
            const path = window.location.pathname || "/editor";
            router.push(`/login?redirectTo=${encodeURIComponent(path)}`);
          }
        }

        prevAuthenticated.current = newAuthenticated;
      } finally {
        syncing = false;
      }
    };

    const onFocus = () => {
      void sync();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void sync();
      }
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [router]);

  /**
   * OAuth 로그인
   */
  const signInWithOAuth = async (
    provider: OAuthProvider,
    nextPath?: string
  ) => {
    const supabase = createClient();
    const safeNext = normalizeInternalPath(nextPath, "");
    const base = window.location.origin;
    const callback = safeNext
      ? `${base}/api/auth/callback?next=${encodeURIComponent(safeNext)}`
      : `${base}/api/auth/callback`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: callback,
      },
    });

    if (error) {
      return { success: false, error };
    }

    return { success: true };
  };

  /**
   * 인증 상태 강제 새로고침
   */
  const refreshAuth = async () => {
    const supabase = createClient();
    const { setUser } = useAuthStore.getState();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    signInWithOAuth,
    refreshAuth,
  };
}
