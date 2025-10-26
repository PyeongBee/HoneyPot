"use client";

import React from "react";
import { useQualityCheckStore } from "../../stores/qualityCheckStore";
import { QualityIssueType } from "../../types/qualityCheck";

interface QualityHighlightedTextProps {
  text: string;
  className?: string;
}

// 기본 하이라이트 스타일 (메모와 동일)
const DEFAULT_HIGHLIGHT_STYLE = "bg-yellow-200 dark:bg-yellow-800/50";

// Hover/Checked 상태 색상 (메모와 동일)
const HOVER_STYLE = "bg-yellow-400 dark:bg-yellow-500/90";

const QualityHighlightedText: React.FC<QualityHighlightedTextProps> = ({
  text,
  className = "",
}) => {
  const { result, hoveredIssueId } = useQualityCheckStore();

  if (!text || !result || result.issues.length === 0) {
    return <div className={className}>{text}</div>;
  }

  // 텍스트를 하이라이팅하기 위해 이슈 위치를 기반으로 분할
  const parts: Array<{
    text: string;
    isHighlighted: boolean;
    issueId?: string;
    issueType?: QualityIssueType;
  }> = [];
  let lastIndex = 0;

  // 위치 기준으로 정렬된 이슈들
  const sortedIssues = [...result.issues].sort((a, b) => a.start - b.start);

  // 겹치는 이슈 필터링 (같은 위치에 여러 이슈가 있으면 첫 번째만)
  const nonOverlappingIssues = sortedIssues.filter((issue, index) => {
    if (index === 0) return true;
    const prevIssue = sortedIssues[index - 1];
    return issue.start >= prevIssue.end;
  });

  nonOverlappingIssues.forEach(issue => {
    // 이전 부분 추가
    if (issue.start > lastIndex) {
      parts.push({
        text: text.slice(lastIndex, issue.start),
        isHighlighted: false,
      });
    }

    // 하이라이트할 부분 추가
    const endPos = issue.end || issue.start + issue.token.length;
    parts.push({
      text: text.slice(issue.start, endPos),
      isHighlighted: true,
      issueId: issue.id,
      issueType: issue.type,
    });

    lastIndex = endPos;
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
        if (part.isHighlighted && part.issueId && part.issueType) {
          const issue = result.issues.find(i => i.id === part.issueId);
          const isChecked = issue?.checked || false;
          const isHovered = hoveredIssueId === part.issueId;

          const bgColor =
            isChecked || isHovered ? HOVER_STYLE : DEFAULT_HIGHLIGHT_STYLE;

          return (
            <span
              key={index}
              className={`transition-all duration-200 ${bgColor} px-1 rounded`}
              title={issue?.message}
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

export default QualityHighlightedText;
