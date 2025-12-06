import React, { useCallback } from "react";

import { Memo } from "../types/editor";

interface UseMemoHighlightProps {
  memos: Memo[];
  highlightedMemo: string | null;
  highlightedRange: { start: number; end: number } | null;
}

interface HighlightRange {
  start: number;
  end: number;
  isCurrent: boolean;
}

interface CharHighlightState {
  isCurrent: boolean;
  isHighlighted: boolean;
}

/**
 * 메모 하이라이트를 관리하는 커스텀 훅
 * 텍스트에 메모 영역을 시각적으로 표시하고, 선택된 메모를 강조 표시합니다.
 */
export const useMemoHighlight = ({
  memos,
  highlightedMemo,
  highlightedRange,
}: UseMemoHighlightProps) => {
  /**
   * 하이라이트 범위를 수집합니다.
   * @param text - 하이라이트를 적용할 텍스트
   * @param startIndex - 텍스트 세그먼트의 시작 인덱스
   * @param endIndex - 텍스트 세그먼트의 끝 인덱스
   * @returns 하이라이트 범위 배열
   */
  const collectHighlightRanges = useCallback(
    (text: string, startIndex: number, endIndex: number): HighlightRange[] => {
      const highlights: HighlightRange[] = [];

      // 현재 선택된 범위 추가
      if (
        highlightedRange &&
        startIndex < highlightedRange.end &&
        endIndex > highlightedRange.start
      ) {
        const highlightStart = Math.max(0, highlightedRange.start - startIndex);
        const highlightEnd = Math.min(text.length, highlightedRange.end - startIndex);

        if (highlightStart < text.length && highlightEnd > 0) {
          highlights.push({
            start: highlightStart,
            end: highlightEnd,
            isCurrent: true,
          });
        }
      }

      // 기존 메모들의 범위 추가
      memos.forEach((memo) => {
        if (startIndex < memo.endIndex && endIndex > memo.startIndex) {
          const memoStart = Math.max(0, memo.startIndex - startIndex);
          const memoEnd = Math.min(text.length, memo.endIndex - startIndex);

          if (memoStart < text.length && memoEnd > 0) {
            highlights.push({
              start: memoStart,
              end: memoEnd,
              isCurrent: highlightedMemo === memo.id,
            });
          }
        }
      });

      return highlights.sort((a, b) => a.start - b.start);
    },
    [memos, highlightedMemo, highlightedRange]
  );

  /**
   * 하이라이트 범위를 문자 단위 상태 배열로 변환합니다.
   * 중복되는 하이라이트를 올바르게 처리하기 위해 각 문자마다 상태를 관리합니다.
   */
  const createCharHighlightMap = useCallback(
    (textLength: number, highlights: HighlightRange[]): CharHighlightState[] => {
      const charHighlights: CharHighlightState[] = new Array(textLength)
        .fill(null)
        .map(() => ({ isCurrent: false, isHighlighted: false }));

      highlights.forEach((highlight) => {
        for (let i = highlight.start; i < highlight.end && i < textLength; i++) {
          charHighlights[i].isHighlighted = true;
          if (highlight.isCurrent) {
            charHighlights[i].isCurrent = true;
          }
        }
      });

      return charHighlights;
    },
    []
  );

  /**
   * 텍스트에 하이라이트를 적용하여 JSX 요소로 반환합니다.
   * @param text - 하이라이트를 적용할 텍스트
   * @param startIndex - 전체 텍스트에서의 시작 인덱스
   * @param endIndex - 전체 텍스트에서의 끝 인덱스
   * @returns 하이라이트가 적용된 JSX 요소
   */
  const applyHighlight = useCallback(
    (text: string, startIndex: number, endIndex: number) => {
      const highlights = collectHighlightRanges(text, startIndex, endIndex);

      if (highlights.length === 0) {
        return text;
      }

      const charHighlights = createCharHighlightMap(text.length, highlights);
      const result: React.ReactElement[] = [];
      let i = 0;

      // 연속된 같은 상태의 문자들을 그룹화하여 렌더링
      while (i < text.length) {
        const currentState = charHighlights[i];
        let j = i;

        // 같은 상태를 가진 연속된 문자들을 찾음
        while (
          j < text.length &&
          charHighlights[j].isHighlighted === currentState.isHighlighted &&
          charHighlights[j].isCurrent === currentState.isCurrent
        ) {
          j++;
        }

        const segment = text.substring(i, j);
        const segmentStartIndex = startIndex + i;
        const segmentEndIndex = startIndex + j;

        if (currentState.isHighlighted) {
          result.push(
            <span
              key={`highlight-${segmentStartIndex}-${segmentEndIndex}`}
              className={`px-1 rounded ${
                currentState.isCurrent
                  ? "bg-yellow-400 dark:bg-yellow-500/90"
                  : "bg-yellow-200 dark:bg-yellow-800/50"
              }`}
              data-start-index={segmentStartIndex}
              data-end-index={segmentEndIndex}
            >
              {segment}
            </span>
          );
        } else {
          result.push(
            <span
              key={`text-${segmentStartIndex}-${segmentEndIndex}`}
              data-start-index={segmentStartIndex}
              data-end-index={segmentEndIndex}
            >
              {segment}
            </span>
          );
        }

        i = j;
      }

      return <>{result}</>;
    },
    [collectHighlightRanges, createCharHighlightMap]
  );

  return { applyHighlight };
};
