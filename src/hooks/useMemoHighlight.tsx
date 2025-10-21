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

      // 하이라이트들을 정렬하고 겹치는 부분 병합
      highlights.sort((a, b) => a.start - b.start);
      const mergedHighlights = [];
      let current = highlights[0];

      for (let i = 1; i < highlights.length; i++) {
        if (highlights[i].start <= current.end) {
          // 겹치는 경우 병합
          current = {
            start: current.start,
            end: Math.max(current.end, highlights[i].end),
            isCurrent: current.isCurrent || highlights[i].isCurrent,
          };
        } else {
          mergedHighlights.push(current);
          current = highlights[i];
        }
      }
      mergedHighlights.push(current);

      // 텍스트를 하이라이트와 함께 렌더링
      const result = [];
      let lastIndex = 0;

      mergedHighlights.forEach((highlight, index) => {
        // 하이라이트 이전 텍스트
        if (highlight.start > lastIndex) {
          result.push(text.substring(lastIndex, highlight.start));
        }

        // 하이라이트된 텍스트
        const highlightText = text.substring(highlight.start, highlight.end);
        result.push(
          <span
            key={`highlight-${index}`}
            className={`px-1 rounded ${
              highlight.isCurrent
                ? "bg-yellow-400 dark:bg-yellow-500/90" // 하이라이트된 메모는 더 진한 노란색
                : "bg-yellow-200 dark:bg-yellow-800/50" // 일반 메모는 연한 노란색
            }`}
          >
            {highlightText}
          </span>
        );

        lastIndex = highlight.end;
      });

      // 마지막 하이라이트 이후 텍스트
      if (lastIndex < text.length) {
        result.push(text.substring(lastIndex));
      }

      return result.length > 1 ? <>{result}</> : text;
    },
    [memos, highlightedMemo, highlightedRange]
  );

  return { applyHighlight };
};
