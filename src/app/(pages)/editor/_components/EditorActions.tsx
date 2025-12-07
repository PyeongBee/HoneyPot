/**
 * 에디터 액션 버튼 영역 컴포넌트
 */

"use client";

import { CheckSquare, FileCheck } from "lucide-react";
import React from "react";

import { Button } from "../../../../components/common/Button";
import { MESSAGES } from "../../../../constants";

interface EditorActionsProps {
  isSpellCheckMode: boolean;
  isQualityCheckMode: boolean;
  isLoading: boolean;
  isTextEmpty: boolean;
  onSpellCheck: () => void;
  onQualityCheck: () => void;
  onCopyOriginal: () => void;
  onCancelSpellCheck: () => void;
  onCancelQualityCheck: () => void;
}

const EditorActions: React.FC<EditorActionsProps> = ({
  isSpellCheckMode,
  isQualityCheckMode,
  isLoading,
  isTextEmpty,
  onSpellCheck,
  onQualityCheck,
  onCopyOriginal,
  onCancelSpellCheck,
  onCancelQualityCheck,
}) => {
  // 맞춤법 검사 모드
  if (isSpellCheckMode) {
    return (
      <Button
        onClick={onCancelSpellCheck}
        variant="secondary"
        className="text-sm"
        disabled={isLoading}
      >
        {MESSAGES.BUTTONS.CANCEL_CHECK}
      </Button>
    );
  }

  // 품질 검사 모드
  if (isQualityCheckMode) {
    return (
      <Button
        onClick={onCancelQualityCheck}
        variant="secondary"
        className="text-sm"
      >
        {MESSAGES.BUTTONS.CANCEL_CHECK}
      </Button>
    );
  }

  // 일반 모드 - 검사 버튼들
  return (
    <>
      <Button
        onClick={onSpellCheck}
        variant="default"
        className="text-sm flex items-center gap-2"
        disabled={isLoading || isTextEmpty}
      >
        <CheckSquare className="w-4 h-4" />
        {MESSAGES.BUTTONS.SPELL_CHECK}
      </Button>
      <Button
        onClick={onQualityCheck}
        variant="default"
        className="text-sm flex items-center gap-2"
        disabled={isLoading || isTextEmpty}
      >
        <FileCheck className="w-4 h-4" />
        품질 검사
      </Button>
      <Button onClick={onCopyOriginal} variant="default" className="text-sm">
        {MESSAGES.BUTTONS.COPY_ORIGINAL}
      </Button>
    </>
  );
};

export default EditorActions;
