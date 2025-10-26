export type QualityIssueType =
  | "sentence_length" // 문장 길이
  | "comma_overuse" // 쉼표 남용
  | "modifier_overuse" // 수식어 남발
  | "repeat" // 반복
  | "colloquial"; // 구어체

export interface QualityIssue {
  id: string;
  type: QualityIssueType;
  message: string;
  start: number;
  end: number;
  token: string;
  severity: "warning" | "error";
  suggestion?: string;
  checked?: boolean;
}

export interface QualityCheckResult {
  issues: QualityIssue[];
  totalIssues: number;
  issueCounts: {
    sentence_length: number;
    comma_overuse: number;
    modifier_overuse: number;
    repeat: number;
    colloquial: number;
  };
}

export interface QualityCheckState {
  isChecking: boolean;
  result: QualityCheckResult | null;
  hoveredIssueId: string | null;
  toggleIssueCheck: (issueId: string) => void;
  getCheckedIssues: () => QualityIssue[];
  setResult: (result: QualityCheckResult) => void;
  clearResult: () => void;
  setChecking: (isChecking: boolean) => void;
  setHoveredIssue: (issueId: string | null) => void;
}
