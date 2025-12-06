"use client";

import React from "react";

import { useSpellCheckStore } from "../../../../stores/spellCheckStore";

interface HighlightedTextProps {
  text: string;
  className?: string;
}

const HighlightedText: React.FC<HighlightedTextProps> = ({
  text,
  className = "",
}) => {
  const { suggestions, hoveredSuggestionId } = useSpellCheckStore();

  if (!text || suggestions.length === 0) {
    return <div className={className}>{text}</div>;
  }

  // 텍스트를 하이라이팅하기 위해 토큰 위치를 기반으로 분할
  const parts: Array<{
    text: string;
    isHighlighted: boolean;
    suggestionId?: string;
  }> = [];
  let lastIndex = 0;

  // 위치 기준으로 정렬된 제안들
  const sortedSuggestions = [...suggestions].sort((a, b) => a.start - b.start);

  sortedSuggestions.forEach(suggestion => {
    // 이전 부분 추가
    if (suggestion.start > lastIndex) {
      parts.push({
        text: text.slice(lastIndex, suggestion.start),
        isHighlighted: false,
      });
    }

    // 하이라이트할 부분 추가
    parts.push({
      text: suggestion.token,
      isHighlighted: true,
      suggestionId: suggestion.id,
    });

    lastIndex = suggestion.end || suggestion.start + suggestion.token.length;
  });

  // 마지막 부분 추가
  if (lastIndex < text.length) {
    parts.push({
      text: text.slice(lastIndex),
      isHighlighted: false,
    });
  }

  return (
    <div className={className}>
      {parts.map((part, index) => {
        if (part.isHighlighted && part.suggestionId) {
          const suggestion = suggestions.find(s => s.id === part.suggestionId);
          const isHovered = hoveredSuggestionId === part.suggestionId;
          const isChecked = suggestion?.isChecked || false;

          let bgColor =
            "bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200"; // 교정 필요

          if (isHovered || isChecked) {
            bgColor =
              "bg-yellow-200 dark:bg-yellow-700 text-yellow-900 dark:text-yellow-100";
          }

          return (
            <span
              key={index}
              className={`transition-all duration-200 ${bgColor} px-1 rounded`}
            >
              {part.text}
            </span>
          );
        }
        return <span key={index}>{part.text}</span>;
      })}
    </div>
  );
};

export default HighlightedText;
