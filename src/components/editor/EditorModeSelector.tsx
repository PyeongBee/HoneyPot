/**
 * 에디터 모드 선택 컴포넌트
 */

"use client";

import React from "react";
import { ViewMode } from "../../types/editor";
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
  const ModeChangeButton = ({
    mode,
    modeText,
  }: {
    mode: ViewMode;
    modeText: string;
  }) => (
    <ModeButton active={viewMode === mode} onClick={() => onModeChange(mode)}>
      {modeText}
    </ModeButton>
  );

  return (
    <div className="flex justify-center gap-0 bg-white dark:bg-gray-800 rounded-full shadow-md border border-gray-200 dark:border-gray-700 p-1">
      <ModeChangeButton mode="original" modeText="원본" />
      <ModeChangeButton mode="edit" modeText="수정" />
      <ModeChangeButton mode="result" modeText="결과" />
    </div>
  );
};

export default EditorModeSelector;
