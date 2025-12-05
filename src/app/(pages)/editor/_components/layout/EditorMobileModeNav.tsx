"use client";

import { ViewMode } from "@/types/editor";
import React from "react";
import { ModeButton } from "./ModeButton";

interface EditorMobileModeNavProps {
  viewMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

const modes: Array<{ mode: ViewMode; label: string }> = [
  { mode: "original", label: "원본" },
  { mode: "edit", label: "수정" },
  { mode: "result", label: "결과" },
];

export default function EditorMobileModeNav({
  viewMode,
  onModeChange,
}: EditorMobileModeNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg z-[1100]">
      <div className="flex items-center justify-around px-2 py-3">
        {modes.map(modeItem => (
          <ModeButton
            key={modeItem.mode}
            variant="text"
            active={viewMode === modeItem.mode}
            onClick={() => onModeChange(modeItem.mode)}
            className="flex-1 text-center"
            aria-label={`${modeItem.label} 모드로 전환`}
          >
            {modeItem.label}
          </ModeButton>
        ))}
      </div>
    </nav>
  );
}

