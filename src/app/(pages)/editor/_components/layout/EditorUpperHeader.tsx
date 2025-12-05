"use client";

import { ViewMode } from "@/types/editor";
import EditorModeSelector from "./EditorModeSelector";

interface EditorUpperHeaderProps {
  viewMode: ViewMode;
  isMobile: boolean;
  isCollapsed: boolean;
  isHeaderVisible: boolean;
  onModeChange: (mode: ViewMode) => void;
}

export default function EditorUpperHeader({
  viewMode,
  isMobile,
  isCollapsed,
  isHeaderVisible,
  onModeChange,
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
              ? "flex items-center justify-between gap-4"
              : "grid grid-cols-[1fr_auto_1fr] items-center gap-4"
          }
        >
          <div className="flex items-center gap-3 min-w-0 justify-start">
            <h1 className="text-lg md:text-2xl font-semibold text-gray-900 truncate">
              자소서 에디터
            </h1>
          </div>

          <div
            className={
              isMobile ? "flex justify-end" : "flex justify-center text-center"
            }
          >
            <EditorModeSelector
              viewMode={viewMode}
              isMobile={isMobile}
              onModeChange={onModeChange}
            />
          </div>

          {!isMobile && <div aria-hidden="true" />}
        </div>
      </div>
    </header>
  );
}
