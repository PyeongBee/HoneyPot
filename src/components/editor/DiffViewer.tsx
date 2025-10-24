import React, { useCallback, useState } from "react";
import { useMemoHighlight } from "../../hooks/useMemoHighlight";
import { useTextSelection } from "../../hooks/useTextSelection";
import { Memo } from "../../types/editor";
import DiffTextRenderer from "./DiffTextRenderer";
import DiffViewerHeader from "./DiffViewerHeader";
import MemoInput from "./MemoInput";

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

  // 텍스트 선택 훅 사용 - final 모드에서만 활성화
  const { textRef, selectedText, showMemoInput, highlightedRange, handleClearSelection } =
    useTextSelection({
      onTextSelected: () => {}, // 필요시 추가 로직 구현
      onSelectionCleared: () => {}, // 필요시 추가 로직 구현
      enabled: viewMode === "final", // 최종 결과 보기에서만 메모 추가 가능
    });

  // 메모 하이라이트 훅 사용
  const { applyHighlight } = useMemoHighlight({
    memos,
    highlightedMemo,
    highlightedRange,
  });

  // 메모 저장 핸들러
  const handleSaveMemo = useCallback(
    (memoText: string) => {
      if (selectedText) {
        // 실제 텍스트와 인덱스 검증
        const actualText = editedText.substring(selectedText.startIndex, selectedText.endIndex);
        console.log('메모 저장:', {
          selectedText: selectedText.text,
          actualText,
          startIndex: selectedText.startIndex,
          endIndex: selectedText.endIndex,
          match: selectedText.text === actualText
        });

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
    [selectedText, editedText, onAddMemo, handleClearSelection]
  );

  return (
    <div className="w-full">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <DiffViewerHeader
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          editedText={editedText}
        />
        <div>
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
            ) : editedText ? (
              applyHighlight(editedText, 0, editedText.length)
            ) : (
              <em className="text-gray-500 dark:text-gray-400">수정된 텍스트가 없습니다.</em>
            )}
          </div>
        </div>
      </div>

      {/* 메모 입력 UI - 최종 결과 모드에서만 표시 (컴포넌트 외부에 fixed 위치) */}
      {viewMode === "final" && showMemoInput && selectedText && (
        <MemoInput
          selectedText={selectedText}
          onSave={handleSaveMemo}
          onCancel={handleClearSelection}
        />
      )}
    </div>
  );
});

export default DiffViewer;
