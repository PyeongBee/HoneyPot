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
  return (
    <div className="flex gap-4">
      <ModeButton
        active={viewMode === "original"}
        onClick={() => onModeChange("original")}
      >
        {isMobile ? "원본" : "원본 모드"}
      </ModeButton>
      <ModeButton
        active={viewMode === "edit"}
        onClick={() => onModeChange("edit")}
      >
        {isMobile ? "수정" : "수정 모드"}
      </ModeButton>
      <ModeButton
        active={viewMode === "result"}
        onClick={() => onModeChange("result")}
      >
        {isMobile ? "결과" : "결과 모드"}
      </ModeButton>
    </div>
  );
};

export default EditorModeSelector;
