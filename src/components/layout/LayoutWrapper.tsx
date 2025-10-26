"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MOBILE_BREAKPOINT } from "../../constants/editor";
import { useConfirmStore } from "../../stores/confirmStore";
import { useSidebarStore } from "../../stores/sidebarStore";
import ConfirmDialog from "../common/ConfirmDialog";
import MobileNavigation from "./MobileNavigation";
import Sidebar from "./Sidebar";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const { isCollapsed, toggleSidebar } = useSidebarStore();
  const { showConfirm } = useConfirmStore();
  const pathname = usePathname();
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
            window.location.href = href;
          },
        });
      } else {
        window.location.href = href;
      }
    } else {
      window.location.href = href;
    }
  };

  useEffect(() => {
    setIsClient(true);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* 데스크톱 사이드바 - 클라이언트에서만 표시 */}
        {!isMobile && isClient && (
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
              isMobile
                ? "pb-16" // 모바일에서는 하단 네비게이션 공간 확보
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

        {/* 모바일 하단 네비게이션 */}
        {isMobile && <MobileNavigation />}
      </div>

      {/* 컨펌 다이얼로그 */}
      <ConfirmDialog />
    </>
  );
}
