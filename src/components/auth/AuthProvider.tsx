"use client";

import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

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
  const { isLoading } = useAuth();

  // 로딩 중에는 아무것도 표시하지 않음 (깜빡임 방지)
  // 필요시 로딩 스피너 추가 가능
  useEffect(() => {
    if (!isLoading) {
      // 인증 상태 로드 완료
      console.log("✅ Auth initialized");
    }
  }, [isLoading]);

  return <>{children}</>;
}

