import React, { useState, useCallback } from "react";
import { Memo } from "../../types/editor";
import MemoInput from "./MemoInput";
import DiffTextRenderer from "./DiffTextRenderer";
import DiffViewerHeader from "./DiffViewerHeader";
import { useTextSelection } from "../../hooks/useTextSelection";

interface DiffViewerProps {
  originalText: string;
  editedText: string;
  memos: Memo[];
  onAddMemo: (memo: Memo) => void;
  highlightedMemo: string | null;
}

const DiffViewer: React.FC<DiffViewerProps> = React.memo(function DiffViewer({
  originalText,
  editedText,
  memos,
  onAddMemo,
  highlightedMemo,
}) {
  const [viewMode, setViewMode] = useState<"diff" | "final">("diff");

  // 텍스트 선택 훅 사용
  const { textRef, selectedText, showMemoInput, highlightedRange, handleClearSelection } =
    useTextSelection({
      onTextSelected: () => {}, // 필요시 추가 로직 구현
      onSelectionCleared: () => {}, // 필요시 추가 로직 구현
    });

  // 메모 저장 핸들러
  const handleSaveMemo = useCallback(
    (memoText: string) => {
      if (selectedText) {
        const newMemo: Memo = {
          id: Date.now().toString(),
          text: memoText,
          selectedText: selectedText.text,
          startIndex: selectedText.startIndex,
          endIndex: selectedText.endIndex,
          timestamp: new Date().toISOString(),
        };

        onAddMemo(newMemo);
        handleClearSelection();
      }
    },
    [selectedText, onAddMemo, handleClearSelection]
  );

  return (
    <div className="w-full">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <DiffViewerHeader
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          editedText={editedText}
        />
        <div className="relative">
          <div
            ref={textRef}
            className="h-128 p-4 mb-1.5 overflow-y-auto text-gray-900 dark:text-white whitespace-pre-wrap"
            role="textbox"
            aria-label={viewMode === "diff" ? "변경사항" : "최종 결과"}
          >
            {viewMode === "diff" ? (
              <DiffTextRenderer
                originalText={originalText}
                editedText={editedText}
                memos={memos}
                highlightedMemo={highlightedMemo}
                highlightedRange={highlightedRange}
              />
            ) : (
              editedText || (
                <em className="text-gray-500 dark:text-gray-400">수정된 텍스트가 없습니다.</em>
              )
            )}
          </div>

          {/* 메모 입력 UI */}
          {showMemoInput && selectedText && (
            <MemoInput
              selectedText={selectedText}
              onSave={handleSaveMemo}
              onCancel={handleClearSelection}
            />
          )}
        </div>
      </div>
    </div>
  );
});

export default DiffViewer;
