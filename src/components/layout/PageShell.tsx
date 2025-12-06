"use client";

import { useEffect } from "react";

import { useDeviceStore } from "@/stores/deviceStore";
import { useSidebarStore } from "@/stores/sidebarStore";
import { cn } from "@/styles/components";

import PageTopBar from "./PageTopBar";

interface PageShellProps {
  title: string;
  children: React.ReactNode;
  showTopBar?: boolean;
  isHeaderVisible?: boolean;
  className?: string;
  contentClassName?: string;
  leftSlot?: React.ReactNode;
  centerSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
}

/**
 * 페이지 상단바와 패딩을 공통으로 적용하는 레이아웃 래퍼.
 * - 기기 타입 감지/리사이즈 대응
 * - 모바일 사이드바 오픈 시 바디 스크롤 잠금
 * - 상단 여백(pt-24 sm:pt-28) 포함
 */
export function PageShell({
  title,
  children,
  showTopBar = true,
  isHeaderVisible = true,
  className,
  contentClassName,
  leftSlot,
  centerSlot,
  rightSlot,
}: PageShellProps) {
  const { isMobile, checkDevice } = useDeviceStore();
  const { isCollapsed, isMobileOpen, openMobileSidebar } = useSidebarStore();

  useEffect(() => {
    checkDevice();
    const handleResize = () => checkDevice();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [checkDevice]);

  useEffect(() => {
    if (!isMobile) return;
    const originalOverflow = document.body.style.overflow;
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalOverflow;
    }
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobile, isMobileOpen]);

  return (
    <div className={cn("min-h-screen pt-24 sm:pt-28", className)}>
      {showTopBar && (
        <PageTopBar
          title={title}
          isMobile={isMobile}
          isCollapsed={isCollapsed}
          isHeaderVisible={isHeaderVisible}
          onMobileMenuClick={openMobileSidebar}
          leftSlot={leftSlot}
          centerSlot={centerSlot}
          rightSlot={rightSlot}
        />
      )}
      <div className={cn("mx-auto w-full", contentClassName)}>{children}</div>
    </div>
  );
}

export default PageShell;
