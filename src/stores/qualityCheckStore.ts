import { create } from "zustand";
import { QualityCheckResult, QualityCheckState } from "../types/qualityCheck";

export const useQualityCheckStore = create<QualityCheckState>((set, get) => ({
  isChecking: false,
  result: null,
  hoveredIssueId: null,

  toggleIssueCheck: (issueId: string) => {
    const { result } = get();
    if (!result) return;

    set({
      result: {
        ...result,
        issues: result.issues.map(issue =>
          issue.id === issueId ? { ...issue, checked: !issue.checked } : issue
        ),
      },
    });
  },

  getCheckedIssues: () => {
    const { result } = get();
    if (!result) return [];
    return result.issues.filter(issue => issue.checked);
  },

  setResult: (result: QualityCheckResult) => {
    set({ result, isChecking: false });
  },

  clearResult: () => {
    set({ result: null, isChecking: false, hoveredIssueId: null });
  },

  setChecking: (isChecking: boolean) => {
    set({ isChecking });
  },

  setHoveredIssue: (issueId: string | null) => {
    set({ hoveredIssueId: issueId });
  },
}));
