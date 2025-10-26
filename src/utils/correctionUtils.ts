/**
 * 텍스트 교정 관련 유틸리티 함수
 */

import { SpellCheckSuggestion } from "../types";
import { QualityIssue } from "../types/qualityCheck";

interface CorrectionItem {
  start: number;
  end: number;
  replacement: string;
}

/**
 * 텍스트에 교정사항을 적용합니다 (뒤에서부터 적용하여 인덱스 유지)
 */
export function applyCorrections(
  text: string,
  corrections: CorrectionItem[]
): string {
  let correctedText = text;

  // 뒤에서부터 적용해야 인덱스가 안 틀어짐
  const sortedCorrections = [...corrections].sort((a, b) => b.start - a.start);

  sortedCorrections.forEach(correction => {
    const before = correctedText.slice(0, correction.start);
    const after = correctedText.slice(correction.end);
    correctedText = before + correction.replacement + after;
  });

  return correctedText;
}

/**
 * 맞춤법 교정 제안을 CorrectionItem으로 변환
 */
export function suggestionToCorrection(
  suggestion: SpellCheckSuggestion
): CorrectionItem {
  return {
    start: suggestion.start,
    end: suggestion.end || suggestion.start + suggestion.token.length,
    replacement: suggestion.selectedSuggestion || suggestion.suggestions[0],
  };
}

/**
 * 품질 검사 이슈를 CorrectionItem으로 변환 (제거 가능한 항목만)
 */
export function issueToCorrection(issue: QualityIssue): CorrectionItem | null {
  // 제거 가능한 타입만 처리
  if (issue.type !== "modifier_overuse" && issue.type !== "repeat") {
    return null;
  }

  // 연속 공백인 경우 하나만 남김
  const isMultipleSpaces = issue.token.match(/^\s+$/);

  return {
    start: issue.start,
    end: issue.end,
    replacement: isMultipleSpaces ? " " : "",
  };
}

/**
 * 제거 가능한 품질 이슈만 필터링
 */
export function filterRemovableIssues(issues: QualityIssue[]): QualityIssue[] {
  return issues.filter(
    issue => issue.type === "modifier_overuse" || issue.type === "repeat"
  );
}
