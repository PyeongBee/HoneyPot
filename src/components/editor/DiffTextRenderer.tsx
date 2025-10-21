import React from "react";
import * as Diff from "diff";
import { useMemoHighlight } from "../../hooks/useMemoHighlight";
import { Memo } from "../../types/editor";

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

const DiffTextRenderer: React.FC<DiffTextRendererProps> = React.memo(function DiffTextRenderer({
  originalText,
  editedText,
  memos,
  highlightedMemo,
  highlightedRange,
}) {
  // diff 라이브러리를 사용하여 변경사항 계산 (띄어쓰기를 포함한 단어 단위 비교)
  const diffParts: DiffPart[] = Diff.diffWordsWithSpace(originalText, editedText);

  // 메모 하이라이트 훅 사용
  const { applyHighlight } = useMemoHighlight({
    memos,
    highlightedMemo,
    highlightedRange,
  });

  // 수정된 텍스트 렌더링 (단어 단위 변경사항 표시, 줄바꿈 시각화)
  const renderEditedText = () => {
    if (!editedText && !originalText) {
      return <em className="text-gray-500 dark:text-gray-400">수정된 텍스트가 없습니다.</em>;
    }

    // diff 결과를 줄 단위로 그룹화
    const lines: React.ReactElement[] = [];
    let currentLine: React.ReactElement[] = [];
    let lineNumber = 1;
    let currentPosition = 0;

    diffParts.forEach((part, index) => {
      const text = part.value;

      // 줄바꿈을 기준으로 분할하되, 빈 줄도 유지
      const lines_in_part = text.split("\n");

      lines_in_part.forEach((linePart, partIndex) => {
        // 텍스트 내용 처리
        if (linePart !== "") {
          const startPos = currentPosition;
          const endPos = currentPosition + linePart.length;

          if (part.removed) {
            currentLine.push(
              <span
                key={`removed-${index}-${partIndex}`}
                className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-1 rounded line-through"
              >
                {applyHighlight(linePart, startPos, endPos)}
              </span>
            );
          } else if (part.added) {
            currentLine.push(
              <span
                key={`added-${index}-${partIndex}`}
                className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-1 rounded"
              >
                {applyHighlight(linePart, startPos, endPos)}
              </span>
            );
          } else {
            currentLine.push(
              <span key={`unchanged-${index}-${partIndex}`}>
                {applyHighlight(linePart, startPos, endPos)}
              </span>
            );
          }

          currentPosition = endPos;
        }

        // 줄바꿈 처리 (마지막 파트가 아닌 경우)
        if (partIndex < lines_in_part.length - 1) {
          // 줄바꿈 기호를 현재 줄 끝에 추가
          if (part.removed) {
            currentLine.push(
              <span
                key={`removed-newline-${index}-${partIndex}`}
                className="text-red-400 text-xs opacity-70 ml-1"
              >
                ↵
              </span>
            );
          } else if (part.added) {
            currentLine.push(
              <span
                key={`added-newline-${index}-${partIndex}`}
                className="text-green-400 text-xs opacity-70 ml-1"
              >
                ↵
              </span>
            );
          } else {
            currentLine.push(
              <span
                key={`unchanged-newline-${index}-${partIndex}`}
                className="text-gray-400 text-xs opacity-50 ml-1"
              >
                ↵
              </span>
            );
          }

          // 현재 줄을 완성하고 새 줄 시작
          lines.push(
            <div key={`line-${lineNumber}`} className="mb-1">
              {currentLine.length > 0 ? currentLine : "\u00A0"}
            </div>
          );
          lineNumber++;
          currentLine = [];
          currentPosition++;
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
});

export default DiffTextRenderer;
