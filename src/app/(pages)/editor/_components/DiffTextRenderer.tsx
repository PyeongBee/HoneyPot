import * as Diff from "diff";
import React from "react";

import { useMemoHighlight } from "../../../../hooks/useMemoHighlight";
import { Memo } from "../../../../types/editor";

interface DiffTextRendererProps {
  originalText: string;
  editedText: string;
  memos: Memo[];
  highlightedMemo: string | null;
  highlightedRange: { start: number; end: number } | null;
}

interface DiffPart {
  value: string;
  added?: boolean;
  removed?: boolean;
}

const NEWLINE_SYMBOL = "↵";
const EMPTY_LINE_PLACEHOLDER = "\u00A0";

/**
 * Diff 텍스트 렌더러 컴포넌트
 * 원본과 수정된 텍스트의 차이를 시각적으로 표시합니다.
 */
const DiffTextRenderer: React.FC<DiffTextRendererProps> = React.memo(
  function DiffTextRenderer({
    originalText,
    editedText,
    memos,
    highlightedMemo,
    highlightedRange,
  }) {
    const diffParts: DiffPart[] = Diff.diffWordsWithSpace(
      originalText,
      editedText
    );

    const { applyHighlight } = useMemoHighlight({
      memos,
      highlightedMemo,
      highlightedRange,
    });

    /**
     * 수정된 텍스트를 렌더링합니다.
     * - 추가된 부분: 초록색 배경
     * - 삭제된 부분: 빨간색 배경 + 취소선
     * - 변경 없는 부분: 일반 텍스트
     * - 줄바꿈: 시각적 기호(↵)로 표시
     */
    const renderEditedText = () => {
      if (!editedText && !originalText) {
        return (
          <em className="text-gray-500 dark:text-gray-400">
            수정된 텍스트가 없습니다.
          </em>
        );
      }

      const lines: React.ReactElement[] = [];
      let currentLine: React.ReactElement[] = [];
      let lineNumber = 1;
      let currentPosition = 0;

      diffParts.forEach((part, index) => {
        const text = part.value;
        const linesInPart = text.split("\n");

        linesInPart.forEach((linePart, partIndex) => {
          // 텍스트 내용 처리
          if (linePart !== "") {
            const startPos = currentPosition;
            const endPos = currentPosition + linePart.length;

            if (part.removed) {
              // 삭제된 텍스트
              currentLine.push(
                <span
                  key={`removed-${index}-${partIndex}`}
                  className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-1 rounded line-through"
                  data-removed="true"
                >
                  {linePart}
                </span>
              );
            } else if (part.added) {
              // 추가된 텍스트
              currentLine.push(
                <span
                  key={`added-${index}-${partIndex}`}
                  className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-1 rounded"
                  data-start-index={startPos}
                  data-end-index={endPos}
                >
                  {applyHighlight(linePart, startPos, endPos)}
                </span>
              );
              currentPosition = endPos;
            } else {
              // 변경되지 않은 텍스트
              currentLine.push(
                <span
                  key={`unchanged-${index}-${partIndex}`}
                  data-start-index={startPos}
                  data-end-index={endPos}
                >
                  {applyHighlight(linePart, startPos, endPos)}
                </span>
              );
              currentPosition = endPos;
            }
          }

          // 줄바꿈 처리
          if (partIndex < linesInPart.length - 1) {
            if (part.removed) {
              currentLine.push(
                <span
                  key={`removed-newline-${index}-${partIndex}`}
                  className="text-red-400 text-xs opacity-70 ml-1"
                  data-removed="true"
                >
                  {NEWLINE_SYMBOL}
                </span>
              );
            } else if (part.added) {
              currentLine.push(
                <span
                  key={`added-newline-${index}-${partIndex}`}
                  className="text-green-400 text-xs opacity-70 ml-1"
                  data-start-index={currentPosition}
                  data-end-index={currentPosition + 1}
                >
                  {NEWLINE_SYMBOL}
                </span>
              );
              currentPosition++;
            } else {
              currentLine.push(
                <span
                  key={`unchanged-newline-${index}-${partIndex}`}
                  className="text-gray-400 text-xs opacity-50 ml-1"
                  data-start-index={currentPosition}
                  data-end-index={currentPosition + 1}
                >
                  {NEWLINE_SYMBOL}
                </span>
              );
              currentPosition++;
            }

            // 현재 줄을 완성하고 새 줄 시작
            lines.push(
              <div key={`line-${lineNumber}`} className="mb-1">
                {currentLine.length > 0 ? currentLine : EMPTY_LINE_PLACEHOLDER}
              </div>
            );
            lineNumber++;
            currentLine = [];
          }
        });
      });

      // 마지막 줄 처리
      if (currentLine.length > 0) {
        lines.push(
          <div key={`line-${lineNumber}`} className="mb-1">
            {currentLine}
          </div>
        );
      }

      return lines;
    };

    return <>{renderEditedText()}</>;
  }
);

export default DiffTextRenderer;
