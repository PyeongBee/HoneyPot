/**
 * 텍스트 교정 적용 훅 (맞춤법 + 품질 검사)
 */

import { useCallback } from "react";
import { useQualityCheckStore } from "../stores/qualityCheckStore";
import { useSpellCheckStore } from "../stores/spellCheckStore";
import {
  applyCorrections,
  filterRemovableIssues,
  issueToCorrection,
  suggestionToCorrection,
} from "../utils/correctionUtils";

interface UseTextCorrectionsProps {
  editedText: string;
  setEditedText: (text: string) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

export function useTextCorrections({
  editedText,
  setEditedText,
  showSuccess,
  showError,
}: UseTextCorrectionsProps) {
  const { getCheckedSuggestions, setSpellCheckMode, clearSuggestions } =
    useSpellCheckStore();

  // 맞춤법 교정 적용
  const applySpellCorrections = useCallback(() => {
    const checkedSuggestions = getCheckedSuggestions();

    if (checkedSuggestions.length === 0) {
      showError("적용할 교정 사항을 선택해주세요.");
      return;
    }

    const corrections = checkedSuggestions.map(suggestionToCorrection);
    const correctedText = applyCorrections(editedText, corrections);

    setEditedText(correctedText);
    setSpellCheckMode(false);
    clearSuggestions();
    showSuccess(`${checkedSuggestions.length}개의 교정 사항이 적용되었습니다.`);
  }, [
    editedText,
    getCheckedSuggestions,
    setEditedText,
    setSpellCheckMode,
    clearSuggestions,
    showSuccess,
    showError,
  ]);

  // 품질 검사 교정 적용
  const applyQualityCorrections = useCallback(
    (onSuccess?: () => void) => {
      const { getCheckedIssues, clearResult } = useQualityCheckStore.getState();
      const checkedIssues = getCheckedIssues();
      const removableIssues = filterRemovableIssues(checkedIssues);

      if (removableIssues.length === 0) {
        showError("제거할 항목을 선택해주세요.");
        return;
      }

      const corrections = removableIssues
        .map(issueToCorrection)
        .filter((c): c is NonNullable<typeof c> => c !== null);
      const correctedText = applyCorrections(editedText, corrections);

      setEditedText(correctedText);
      clearResult();
      showSuccess(`${removableIssues.length}개의 항목이 제거되었습니다.`);
      onSuccess?.();
    },
    [editedText, setEditedText, showSuccess, showError]
  );

  return {
    applySpellCorrections,
    applyQualityCorrections,
  };
}
