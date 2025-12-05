"use client";

import { Button } from "@/components/common/Button";
import { Card, CardDescription, CardTitle } from "@/components/common/Card";
import ToggleSwitch from "@/components/common/ToggleSwitch";
import { signOut } from "@/lib/actions/auth";
import { useAuthStore } from "@/stores/authStore";
import { useConfirmStore } from "@/stores/confirmStore";
import { useToastStore } from "@/stores/toastStore";
import { clearShareHistory } from "@/utils/shareHistoryUtils";
import { Database, Moon, Sun, Trash2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { showSuccess, showError } = useToastStore();
  const { showConfirm } = useConfirmStore();

  // 설정 상태들
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    updates: true,
  });

  // 다크모드 초기화
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setIsDarkMode(isDark);
  }, []);

  // 다크모드 토글
  const handleDarkModeToggle = useCallback(
    (checked: boolean) => {
      setIsDarkMode(checked);
      if (checked) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      showSuccess(
        checked
          ? "다크 모드가 활성화되었습니다."
          : "라이트 모드가 활성화되었습니다."
      );
    },
    [showSuccess]
  );

  // 알림 설정 토글
  const handleNotificationToggle = useCallback(
    (key: keyof typeof notifications, checked: boolean) => {
      setNotifications(prev => ({
        ...prev,
        [key]: checked,
      }));
      showSuccess("알림 설정이 저장되었습니다.");
    },
    [showSuccess]
  );

  // 로컬 공유 기록 삭제
  const handleClearHistory = useCallback(() => {
    showConfirm({
      message:
        "이 브라우저의 모든 로컬 공유 기록을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.",
      confirmText: "로컬 기록 삭제",
      variant: "destructive",
      onConfirm: () => {
        try {
          clearShareHistory();
          showSuccess("로컬 공유 기록이 모두 삭제되었습니다.");
        } catch (error) {
          console.error("로컬 공유 기록 삭제 실패:", error);
          showError("로컬 공유 기록 삭제에 실패했습니다.");
        }
      },
    });
  }, [showConfirm, showSuccess, showError]);

  // 로그아웃
  const handleLogout = useCallback(async () => {
    try {
      await signOut();
      showSuccess("로그아웃되었습니다.");
      router.push("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      showError("로그아웃에 실패했습니다.");
    }
  }, [showSuccess, showError, router]);

  // 계정 삭제
  const handleDeleteAccount = useCallback(() => {
    showConfirm({
      message:
        "정말로 계정을 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없으며,\n모든 데이터가 영구적으로 삭제됩니다.",
      confirmText: "계정 삭제",
      variant: "destructive",
      onConfirm: () => {
        // TODO: 계정 삭제 API 구현
        showError("계정 삭제 기능은 현재 준비 중입니다.");
      },
    });
  }, [showConfirm, showError]);

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            설정
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            계정 및 앱 설정을 관리하세요
          </p>
        </div>

        <div className="space-y-6">
          {/* 계정 정보 */}
          {user && (
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <CardTitle className="mb-0">계정 정보</CardTitle>
              </div>
              <CardDescription>가입한 계정의 기본 정보입니다.</CardDescription>

              <div className="space-y-4 mt-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    이메일
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {user.email}
                  </span>
                </div>
                {user.created_at && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      가입일
                    </span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {formatDate(user.created_at)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    로그인 방법
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {user.app_metadata?.provider || "이메일"}
                  </span>
                </div>
              </div>
            </Card>
          )}

          {/* 테마 설정 */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              {isDarkMode ? (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
              <CardTitle className="mb-0">테마 설정</CardTitle>
            </div>
            <CardDescription>앱의 테마를 변경할 수 있습니다.</CardDescription>

            <div className="mt-4">
              <div className="flex items-center justify-between py-3">
                <div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white block mb-1">
                    다크 모드
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    어두운 테마를 사용합니다
                  </span>
                </div>
                <ToggleSwitch
                  checked={isDarkMode}
                  onChange={handleDarkModeToggle}
                />
              </div>
            </div>
          </Card>

          {/* 데이터 관리 */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <CardTitle className="mb-0">데이터 관리</CardTitle>
            </div>
            <CardDescription>
              저장된 데이터를 관리할 수 있습니다.
            </CardDescription>

            <div className="space-y-3 mt-4">
              <Button
                variant="outline"
                onClick={handleClearHistory}
                className="w-full justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <Trash2 className="w-4 h-4" />
                  <div>
                    <div className="text-sm font-medium">
                      로컬 공유 기록 삭제
                    </div>
                    <div className="text-xs text-gray-500">
                      이 브라우저에 저장된 공유 기록을 모두 삭제합니다
                    </div>
                  </div>
                </div>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
