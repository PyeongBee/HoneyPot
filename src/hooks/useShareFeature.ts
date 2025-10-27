import { useCallback } from "react";
import { ShareData } from "../types/editor";
import {
  copyToClipboard,
  createShareUrl,
  generateShareId,
} from "../utils/clipboardUtils";
import { saveShareHistory } from "../utils/shareHistoryUtils";

export function useShareFeature(
  showSuccess: (message: string) => void,
  showError: (message: string) => void
) {
  // 링크 생성 (복사는 하지 않음)
  const createShare = useCallback((shareData: ShareData): string => {
    if (!shareData.original && !shareData.edited) {
      throw new Error("공유할 내용이 없습니다.");
    }

    const url = createShareUrl(shareData);
    const shareId = generateShareId();

    saveShareHistory(shareData, url);

    return url;
  }, []);

  // 링크 복사
  const copyShareUrl = useCallback(
    async (url: string): Promise<boolean> => {
      try {
        await copyToClipboard(url);
        showSuccess("링크가 클립보드에 복사되었습니다!");
        return true;
      } catch (error) {
        console.error("복사 실패:", error);
        showError("링크 복사에 실패했습니다.");
        return false;
      }
    },
    [showSuccess, showError]
  );

  return {
    createShare,
    copyShareUrl,
  };
}
