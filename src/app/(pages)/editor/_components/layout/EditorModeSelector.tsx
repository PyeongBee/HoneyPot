"use client";

import { ViewMode } from "@/types/editor";
import React from "react";
import { ModeButton } from "./ModeButton";

interface EditorModeSelectorProps {
  viewMode: ViewMode;
  isMobile: boolean;
  onModeChange: (mode: ViewMode) => void;
}

const EditorModeSelector: React.FC<EditorModeSelectorProps> = ({
  viewMode,
  isMobile,
  onModeChange,
}) => {
  const modes: Array<{
    mode: ViewMode;
    mobileLabel: string;
    desktopLabel: string;
  }> = [
    { mode: "original", mobileLabel: "원본", desktopLabel: "원본 모드" },
    { mode: "edit", mobileLabel: "수정", desktopLabel: "수정 모드" },
    { mode: "result", mobileLabel: "결과", desktopLabel: "결과 모드" },
  ];

  return (
    <nav
      className="flex items-center gap-2 md:gap-3 text-gray-700 dark:text-gray-100"
      aria-label="편집 모드 전환"
    >
      {modes.map((modeItem, index) => (
        <React.Fragment key={modeItem.mode}>
          <ModeButton
            variant="text"
            active={viewMode === modeItem.mode}
            onClick={() => onModeChange(modeItem.mode)}
          >
            {isMobile ? modeItem.mobileLabel : modeItem.desktopLabel}
          </ModeButton>
          {index < modes.length - 1 && (
            <span
              className="text-gray-400 dark:text-gray-500"
              aria-hidden="true"
            >
              |
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default EditorModeSelector;
