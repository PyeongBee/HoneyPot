import { Menu } from "lucide-react";
import React from "react";

import { cn } from "@/styles/components";

interface PageTopBarProps {
  title: string;
  isMobile: boolean;
  isCollapsed: boolean;
  isHeaderVisible?: boolean; // 스크롤 시 숨김/표시 제어 (기본 true)
  onMobileMenuClick?: () => void;
  leftSlot?: React.ReactNode;
  centerSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
}

export function PageTopBar({
  title,
  isMobile,
  isCollapsed,
  isHeaderVisible = true,
  onMobileMenuClick,
  leftSlot,
  centerSlot,
  rightSlot,
}: PageTopBarProps) {
  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-[500] bg-white text-gray-900 px-3 md:px-8 py-3 flex items-center justify-center transition-all duration-200 ease-in-out dark:bg-gray-900",
        isHeaderVisible ? "translate-y-0" : "-translate-y-full",
        isMobile ? "left-0" : isCollapsed ? "left-16" : "left-64"
      )}
    >
      <div className="w-full">
        <div
          className={
            isMobile
              ? "flex items-center justify-between gap-3"
              : "grid grid-cols-[1fr_auto_1fr] items-center gap-4"
          }
        >
          {/* Left */}
          {isMobile ? (
            <div className="w-32 flex justify-start gap-2">
              {leftSlot ?? (
                <button
                  type="button"
                  className="rounded-full p-2 transition-colors hover:bg-gray-100 active:bg-gray-200"
                  onClick={onMobileMenuClick}
                  aria-label="메뉴 열기"
                >
                  <Menu className="h-6 w-6 text-gray-800" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex min-w-0 items-center gap-3 justify-start">
              {leftSlot ?? (
                <h1 className="truncate text-lg font-semibold text-gray-900 md:text-2xl">
                  {title}
                </h1>
              )}
            </div>
          )}

          {/* Center */}
          <div className="flex justify-center text-center">
            {isMobile ? (
              <h1 className="text-base font-semibold text-gray-900 truncate">
                {title}
              </h1>
            ) : (
              centerSlot
            )}
          </div>

          {/* Right */}
          {isMobile ? (
            <div className="w-32 flex justify-end gap-2">{rightSlot}</div>
          ) : (
            <div className="flex items-center justify-end gap-3">
              {rightSlot}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default PageTopBar;
