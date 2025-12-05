"use client";

import { ViewMode } from "@/types/editor";
import { Menu, Share2 } from "lucide-react";
import EditorModeSelector from "./EditorModeSelector";

interface EditorUpperHeaderProps {
  viewMode: ViewMode;
  isMobile: boolean;
  isCollapsed: boolean;
  isHeaderVisible: boolean;
  onModeChange: (mode: ViewMode) => void;
  onMobileMenuClick?: () => void;
  onShareClick?: () => void;
}

export default function EditorUpperHeader({
  viewMode,
  isMobile,
  isCollapsed,
  isHeaderVisible,
  onModeChange,
  onMobileMenuClick,
  onShareClick,
}: EditorUpperHeaderProps) {
  return (
    <header
      className={`
        fixed top-0 right-0 z-[1000] 
        bg-white text-gray-900
        px-4 md:px-8 py-3
        flex items-center justify-center
        transition-all duration-300 ease-in-out
        ${!isHeaderVisible ? "-translate-y-full" : "translate-y-0"}
        ${isMobile ? "left-0" : isCollapsed ? "left-16" : "left-64"}
      `}
    >
      <div className="w-full">
        <div
          className={
            isMobile
              ? "flex items-center justify-between gap-3"
              : "grid grid-cols-[1fr_auto_1fr] items-center gap-4"
          }
        >
          {isMobile ? (
            <>
              <button
                type="button"
                className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
                onClick={onMobileMenuClick}
                aria-label="메뉴 열기"
              >
                <Menu className="w-6 h-6 text-gray-800" />
              </button>

              <div className="flex-1 text-center">
                <h1 className="text-base font-semibold text-gray-900 truncate">
                  자소서 에디터
                </h1>
              </div>

              <button
                type="button"
                className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
                onClick={onShareClick}
                aria-label="공유하기"
              >
                <Share2 className="w-5 h-5 text-gray-800" />
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 min-w-0 justify-start">
                <h1 className="text-lg md:text-2xl font-semibold text-gray-900 truncate">
                  자소서 에디터
                </h1>
              </div>

              <div className="flex justify-center text-center">
                <EditorModeSelector
                  viewMode={viewMode}
                  isMobile={isMobile}
                  onModeChange={onModeChange}
                />
              </div>

              <div aria-hidden="true" />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
