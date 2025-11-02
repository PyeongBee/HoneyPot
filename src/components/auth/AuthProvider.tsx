"use client";

import { useAuth } from "@/hooks/useAuth";

/**
 * 인증 상태를 전역적으로 관리하는 Provider
 * 모든 페이지에서 인증 상태를 자동으로 동기화합니다.
 */
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // useAuth를 호출하여 전역 인증 상태 초기화 및 구독
  useAuth();

  return <>{children}</>;
}
