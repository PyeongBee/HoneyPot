"use client";

import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/stores/authStore";
import { OAuthProvider } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * 인증 관련 Hook
 * 클라이언트에서 인증 상태를 관리하고 OAuth 로그인을 처리합니다.
 */
export function useAuth() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, setUser, setLoading } =
    useAuthStore();
  const supabase = createClient();

  useEffect(() => {
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
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      router.refresh();
    });

    return () => subscription.unsubscribe();
  }, [router, setUser, setLoading, supabase]);

  /**
   * OAuth 로그인
   */
  const signInWithOAuth = async (provider: OAuthProvider) => {
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

  return {
    user,
    isLoading,
    isAuthenticated,
    signInWithOAuth,
  };
}
