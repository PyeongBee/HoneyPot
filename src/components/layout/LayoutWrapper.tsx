"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MOBILE_BREAKPOINT } from "../../constants/editor";
import { useConfirmStore } from "../../stores/confirmStore";
import { useSidebarStore } from "../../stores/sidebarStore";
import { ToastData, useToastStore } from "../../stores/toastStore";
import AuthProvider from "../auth/AuthProvider";
import ConfirmDialog from "../common/ConfirmDialog";
import Toast from "../common/Toast";
import MobileNavigation from "./MobileNavigation";
import Sidebar from "./Sidebar";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { isCollapsed, toggleSidebar } = useSidebarStore();
  const { showConfirm } = useConfirmStore();
  const { toasts, removeToast } = useToastStore();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // 에디터 페이지에서 unsaved changes 확인
  const handleNavigation = (href: string) => {
    if (pathname === "/editor") {
      // 에디터 페이지에서 나갈 때 확인
      const editorContent = sessionStorage.getItem("editorContent");
      const hasRealContent =
        editorContent &&
        editorContent.trim() &&
        editorContent.trim().length > 0;

      if (hasRealContent) {
        showConfirm({
          message:
            "입력한 내용이 있습니다. 정말 나가시겠습니까?\n저장되지 않은 내용은 사라집니다.",
          confirmText: "나가기",
          variant: "destructive",
          onConfirm: () => {
            sessionStorage.removeItem("editorContent");
            router.push(href);
          },
        });
      } else {
        router.push(href);
      }
    } else {
      router.push(href);
    }
  };

  useEffect(() => {
    setIsClient(true);

    // 다크모드 초기화
    const theme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (theme === "dark" || (!theme && prefersDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 인증 페이지인지 확인 (네비게이션 숨김)
  const isAuthPage = pathname === "/reset-password";

  return (
    <AuthProvider>
      <div className="flex h-screen dark:bg-gray-900">
        {/* 데스크톱 사이드바 - 클라이언트에서만 표시, 인증 페이지에서는 숨김 */}
        {!isMobile && isClient && !isAuthPage && (
          <div className="relative">
            <Sidebar
              isCollapsed={isCollapsed}
              onToggle={toggleSidebar}
              onNavigate={handleNavigation}
            />
          </div>
        )}

        {/* 메인 컨텐츠 영역 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main
            className={`flex-1 overflow-auto ${
              isMobile && !isAuthPage
                ? "pb-16" // 모바일에서는 하단 네비게이션 공간 확보 (인증 페이지 제외)
                : ""
            }`}
          >
            <div
              className={`mx-auto ${isMobile ? "w-full px-4" : "w-full px-6"}`}
            >
              {children}
            </div>
          </main>
        </div>

        {/* 모바일 하단 네비게이션 - 인증 페이지에서는 숨김 */}
        {isMobile && !isAuthPage && <MobileNavigation />}
      </div>

      {/* 컨펌 다이얼로그 */}
      <ConfirmDialog />

      {/* 토스트 메시지 - 전역에서 사용 */}
      {toasts.map((toast: ToastData) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </AuthProvider>
  );
}
