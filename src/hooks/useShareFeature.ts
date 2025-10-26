/**
 * 공유 기능 훅
 */

import { useCallback, useState } from "react";
import { COPY_SUCCESS_DURATION } from "../constants/editor";
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
  const [shareUrl, setShareUrl] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleShare = useCallback(
    (shareData: ShareData) => {
      if (!shareData.original && !shareData.edited) {
        showError("공유할 내용이 없습니다.");
        return;
      }

      try {
        const url = createShareUrl(shareData);
        const shareId = generateShareId();
        const title = shareData.question || "제목 없음";

        saveShareHistory(shareData, url);

        setShareUrl(url);

        copyToClipboard(url);
        setIsCopied(true);
        showSuccess("공유 링크가 클립보드에 복사되었습니다!");

        setTimeout(() => {
          setIsCopied(false);
        }, COPY_SUCCESS_DURATION);
      } catch (error) {
        console.error("공유 실패:", error);
        showError("공유 링크 생성에 실패했습니다.");
      }
    },
    [showSuccess, showError]
  );

  const handleCopyUrl = useCallback(() => {
    if (shareUrl) {
      copyToClipboard(shareUrl);
      setIsCopied(true);
      showSuccess("링크가 클립보드에 복사되었습니다!");

      setTimeout(() => {
        setIsCopied(false);
      }, COPY_SUCCESS_DURATION);
    }
  }, [shareUrl, showSuccess]);

  return {
    shareUrl,
    isCopied,
    handleShare,
    handleCopyUrl,
  };
}
