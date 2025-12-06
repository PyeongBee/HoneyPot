import { User } from "@supabase/supabase-js";
import { create } from "zustand";

import { AuthActions, AuthState } from "@/types/auth";

import { useToastStore } from "./toastStore";

/**
 * 인증 상태를 관리하는 Zustand Store
 * 전역에서 사용자 인증 정보를 관리합니다.
 */

interface AuthStoreState extends AuthState, AuthActions {}

export const useAuthStore = create<AuthStoreState>(set => ({
  // 초기 상태
  user: null,
  isLoading: true,
  isAuthenticated: false,

  // Actions
  setUser: (user: User | null) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),

  setLoading: (isLoading: boolean) => set({ isLoading }),

  reset: () => {
    // 토스트 스토어도 함께 초기화
    useToastStore.getState().clearAllToasts();

    set({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  },
}));
