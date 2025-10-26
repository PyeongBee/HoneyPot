import { useCallback } from "react";
import { useQualityCheckStore } from "../stores/qualityCheckStore";
import { QualityCheckResult } from "../types/qualityCheck";

export const useQualityCheck = () => {
  const { setResult, setChecking, clearResult } = useQualityCheckStore();

  const checkQuality = useCallback(
    async (text: string) => {
      if (!text.trim()) {
        clearResult();
        return;
      }

      setChecking(true);

      try {
        const response = await fetch("/api/quality-check", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text }),
        });

        if (!response.ok) {
          throw new Error("품질 검사 요청 실패");
        }

        const result: QualityCheckResult = await response.json();
        setResult(result);
      } catch (error) {
        console.error("품질 검사 실패:", error);
        setChecking(false);
      }
    },
    [setResult, setChecking, clearResult]
  );

  return { checkQuality };
};
