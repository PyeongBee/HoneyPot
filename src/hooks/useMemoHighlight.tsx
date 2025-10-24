import { useCallback } from "react";
import { Memo } from "../types/editor";

interface UseMemoHighlightProps {
  memos: Memo[];
  highlightedMemo: string | null;
  highlightedRange: { start: number; end: number } | null;
}

export const useMemoHighlight = ({
  memos,
  highlightedMemo,
  highlightedRange,
}: UseMemoHighlightProps) => {
  const applyHighlight = useCallback(
    (text: string, startIndex: number, endIndex: number) => {
      const highlights: Array<{
        start: number;
        end: number;
        isCurrent: boolean;
      }> = [];

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
          
          // 디버깅: 하이라이트 범위 출력
          console.log('하이라이트 적용:', {
            textLength: text.length,
            textStartIndex: startIndex,
            textEndIndex: endIndex,
            highlightedRange,
            relativeStart: highlightStart,
            relativeEnd: highlightEnd,
            highlightedText: text.substring(highlightStart, highlightEnd)
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

      // 하이라이트가 없으면 원본 텍스트 반환
      if (highlights.length === 0) {
        return text;
      }

      // 하이라이트들을 정렬
      highlights.sort((a, b) => a.start - b.start);

      // 각 문자 위치에 대한 하이라이트 상태 매핑 (중복 렌더링 방지)
      const charHighlights: Array<{ isCurrent: boolean; isHighlighted: boolean }> = 
        new Array(text.length).fill(null).map(() => ({ isCurrent: false, isHighlighted: false }));

      highlights.forEach((highlight) => {
        for (let i = highlight.start; i < highlight.end && i < text.length; i++) {
          charHighlights[i].isHighlighted = true;
          if (highlight.isCurrent) {
            charHighlights[i].isCurrent = true;
          }
        }
      });

      // 연속된 같은 상태의 문자들을 그룹화하여 렌더링
      const result = [];
      let i = 0;

      while (i < text.length) {
        const currentState = charHighlights[i];
        let j = i;

        // 같은 상태인 문자들을 찾음
        while (
          j < text.length &&
          charHighlights[j].isHighlighted === currentState.isHighlighted &&
          charHighlights[j].isCurrent === currentState.isCurrent
        ) {
          j++;
        }

        const segment = text.substring(i, j);

        if (currentState.isHighlighted) {
          result.push(
            <span
              key={`highlight-${i}-${j}`}
              className={`px-1 rounded ${
                currentState.isCurrent
                  ? "bg-yellow-400 dark:bg-yellow-500/90" // 현재 선택/호버된 메모
                  : "bg-yellow-200 dark:bg-yellow-800/50" // 일반 메모
              }`}
              data-start-index={startIndex + i}
              data-end-index={startIndex + j}
            >
              {segment}
            </span>
          );
        } else {
          result.push(
            <span
              key={`text-${i}-${j}`}
              data-start-index={startIndex + i}
              data-end-index={startIndex + j}
            >
              {segment}
            </span>
          );
        }

        i = j;
      }

      return <>{result}</>;
    },
    [memos, highlightedMemo, highlightedRange]
  );

  return { applyHighlight };
};
