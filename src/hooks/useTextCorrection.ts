/**
 * 텍스트 교정 적용을 위한 공통 훅
 */

import { useCallback } from "react";

import { useToastStore } from "../stores/toastStore";
import { applyCorrections } from "../utils/correctionUtils";

interface CorrectionItem {
  start: number;
  end: number;
  replacement: string;
}

interface UseTextCorrectionOptions {
  onSuccess?: () => void;
  onError?: () => void;
}

export function useTextCorrection(
  text: string,
  setText: (text: string) => void,
  options?: UseTextCorrectionOptions
) {
  const { showSuccess, showError } = useToastStore();

  const applyTextCorrections = useCallback(
    (
      corrections: CorrectionItem[],
      successMessage: string,
      errorMessage: string = "적용할 항목을 선택해주세요."
    ) => {
      if (corrections.length === 0) {
        showError(errorMessage);
        options?.onError?.();
        return false;
      }

      const correctedText = applyCorrections(text, corrections);
      setText(correctedText);
      showSuccess(successMessage);
      options?.onSuccess?.();

      return true;
    },
    [text, setText, showSuccess, showError, options]
  );

  return { applyTextCorrections };
}
