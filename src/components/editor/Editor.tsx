/**
 * 텍스트 에디터 컴포넌트
 */

"use client";

import React, { useCallback } from "react";
import { MESSAGES } from "../../constants";
import { useQualityCheck } from "../../hooks/useQualityCheck";
import { useSpellCheck } from "../../hooks/useSpellCheck";
import { useQualityCheckStore } from "../../stores/qualityCheckStore";
import { useToastStore } from "../../stores/toastStore";
import { cn } from "../../styles/components";
import Toast from "../common/Toast";
import EditorActions from "./EditorActions";
import HighlightedText from "./HighlightedText";
import QualityHighlightedText from "./QualityHighlightedText";

interface EditorProps {
  originalText: string;
  editedText: string;
  onEditedChange: (text: string) => void;
  onQualityCheckToggle?: (isActive: boolean) => void;
}

const Editor: React.FC<EditorProps> = React.memo(function Editor({
  originalText,
  editedText,
  onEditedChange,
  onQualityCheckToggle,
}) {
  const { toasts, showError, showSuccess, removeToast } = useToastStore();
  const { isSpellCheckMode, isLoading, performSpellCheck, cancelSpellCheck } =
    useSpellCheck({
      showError,
      showSuccess,
    });
  const { checkQuality } = useQualityCheck();
  const { result: qualityResult, clearResult: clearQualityResult } =
    useQualityCheckStore();

  const isQualityCheckMode = !!qualityResult;
  const isTextEmpty = !editedText.trim();

  const handleCopyOriginal = useCallback(() => {
    onEditedChange(originalText);
  }, [originalText, onEditedChange]);

  const handleSpellCheck = useCallback(() => {
    performSpellCheck(editedText);
  }, [editedText, performSpellCheck]);

  const handleQualityCheck = useCallback(async () => {
    await checkQuality(editedText);
    onQualityCheckToggle?.(true);
  }, [editedText, checkQuality, onQualityCheckToggle]);

  const handleCancelQualityCheck = useCallback(() => {
    clearQualityResult();
    onQualityCheckToggle?.(false);
  }, [clearQualityResult, onQualityCheckToggle]);

  // 에디터 내용 렌더링
  const renderEditorContent = () => {
    if (isSpellCheckMode) {
      return (
        <div className="w-full h-128 px-4 pt-4 pb-0 overflow-y-auto">
          <HighlightedText
            text={editedText}
            className="whitespace-pre-wrap text-gray-900 dark:text-white leading-relaxed"
          />
        </div>
      );
    }

    if (isQualityCheckMode) {
      return (
        <div className="w-full h-128 px-4 pt-4 pb-0 overflow-y-auto">
          <QualityHighlightedText
            text={editedText}
            className="whitespace-pre-wrap text-gray-900 dark:text-white leading-relaxed"
          />
        </div>
      );
    }

    return (
      <textarea
        className={cn(
          "w-full h-128 px-4 pt-4 pb-0 border-0 resize-none",
          "focus:outline-none focus:ring-0 bg-transparent",
          "text-gray-900 dark:text-white",
          "placeholder-gray-500 dark:placeholder-gray-400"
        )}
        value={editedText}
        onChange={e => onEditedChange(e.target.value)}
        placeholder={MESSAGES.LABELS.EDIT_PLACEHOLDER}
        aria-label={MESSAGES.LABELS.EDITOR_ARIA}
      />
    );
  };

  return (
    <>
      <div className="w-full">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center px-4 py-3.5 border-b border-gray-200 dark:border-gray-700">
            <label className="text-lg font-semibold text-gray-900 dark:text-white">
              {MESSAGES.LABELS.EDITOR_TITLE}
            </label>
            <div className="flex items-center gap-2">
              <EditorActions
                isSpellCheckMode={isSpellCheckMode}
                isQualityCheckMode={isQualityCheckMode}
                isLoading={isLoading}
                isTextEmpty={isTextEmpty}
                onSpellCheck={handleSpellCheck}
                onQualityCheck={handleQualityCheck}
                onCopyOriginal={handleCopyOriginal}
                onCancelSpellCheck={cancelSpellCheck}
                onCancelQualityCheck={handleCancelQualityCheck}
              />
            </div>
          </div>
          {renderEditorContent()}
        </div>
      </div>

      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );
});

export default Editor;
