"use client";

import { useEffect } from "react";

import { useDeviceStore } from "@/stores/deviceStore";
import { useLayoutStore } from "@/stores/layoutStore";
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

export function PageShell({
  title,
  children,
  showTopBar = true,
  className,
  isHeaderVisible = true,
  contentClassName,
  leftSlot,
  centerSlot,
  rightSlot,
}: PageShellProps) {
  const { isMobile, checkDevice } = useDeviceStore();
  const { isCollapsed, isMobileOpen, openMobileSidebar } = useSidebarStore();
  const { isHeaderHidden } = useLayoutStore();

  const finalHeaderVisible = isHeaderVisible && !isHeaderHidden;

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
          isHeaderVisible={finalHeaderVisible}
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
