import React, { useCallback, useState } from "react";
import { useMemoHighlight } from "../../../../hooks/useMemoHighlight";
import { useTextSelection } from "../../../../hooks/useTextSelection";
import { Memo } from "../../../../types/editor";
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

  const isFinalMode = viewMode === "final";

  // 텍스트 선택 훅 - 최종 결과 모드에서만 활성화
  const {
    textRef,
    selectedText,
    showMemoInput,
    highlightedRange,
    handleClearSelection,
  } = useTextSelection({
    onTextSelected: () => {},
    onSelectionCleared: () => {},
    enabled: isFinalMode,
  });

  // 메모 하이라이트 훅
  const { applyHighlight } = useMemoHighlight({
    memos,
    highlightedMemo,
    highlightedRange,
  });

  /**
   * 메모 저장 핸들러
   * 선택된 텍스트에 대한 메모를 생성하고 저장합니다.
   */
  const handleSaveMemo = useCallback(
    (memoText: string) => {
      if (!selectedText) {
        return;
      }

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
    },
    [selectedText, onAddMemo, handleClearSelection]
  );

  /**
   * 뷰 모드에 따른 콘텐츠를 렌더링합니다.
   */
  const renderContent = () => {
    if (viewMode === "diff") {
      return (
        <DiffTextRenderer
          originalText={originalText}
          editedText={editedText}
          memos={memos}
          highlightedMemo={highlightedMemo}
          highlightedRange={highlightedRange}
        />
      );
    }

    if (!editedText) {
      return (
        <em className="text-gray-500 dark:text-gray-400">
          수정된 텍스트가 없습니다.
        </em>
      );
    }

    return applyHighlight(editedText, 0, editedText.length);
  };

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
            {renderContent()}
          </div>
        </div>
      </div>

      {/* 메모 입력 모달 - 최종 결과 모드에서만 표시 */}
      {isFinalMode && showMemoInput && selectedText && (
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
