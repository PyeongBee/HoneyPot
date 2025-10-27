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
        bg-gradient-to-br from-brand-400 to-brand-500 text-white
        px-8 py-2 shadow-lg
        flex justify-between items-center
        transition-all duration-300 ease-in-out
        ${!isHeaderVisible ? "-translate-y-full" : "translate-y-0"}
        ${isMobile ? "left-0" : isCollapsed ? "left-16" : "left-64"}
      `}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <h1 className="text-2xl font-semibold truncate">자소서 에디터</h1>
      </div>

      <EditorModeSelector
        viewMode={viewMode}
        isMobile={isMobile}
        onModeChange={onModeChange}
      />
    </header>
  );
}
