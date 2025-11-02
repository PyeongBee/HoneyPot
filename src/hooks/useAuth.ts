"use client";

import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/authStore";
import { OAuthProvider } from "@/types/auth";
import { useEffect } from "react";

/**
 * 인증 관련 Hook
 * 클라이언트에서 인증 상태를 관리하고 OAuth 로그인을 처리합니다.
 */
export function useAuth() {
  const { user, isLoading, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const supabase = createClient();
    const { setUser, setLoading } = useAuthStore.getState();

    // 초기 세션 확인
    const initializeAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    initializeAuth();

    // 인증 상태 변경 리스너
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * OAuth 로그인
   */
  const signInWithOAuth = async (provider: OAuthProvider) => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      return { success: false, error };
    }

    return { success: true };
  };

  /**
   * 인증 상태 강제 새로고침
   * 로그인/로그아웃 후 즉시 상태를 업데이트할 때 사용
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
