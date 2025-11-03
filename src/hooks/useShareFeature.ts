import { useCallback } from "react";
import { ShareData } from "../types/editor";
import {
  copyToClipboard,
  createShareUrl,
  generateShareId,
} from "../utils/clipboardUtils";
import { saveShareHistory } from "../utils/shareHistoryUtils";
import { useAuthStore } from "@/stores/authStore";

export function useShareFeature(
  showSuccess: (message: string) => void,
  showError: (message: string) => void
) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  // 링크 생성 (복사는 하지 않음)
  const createShare = useCallback(
    async (shareData: ShareData): Promise<string> => {
      const hasContent = Boolean(
        (shareData as any)?.original ||
          (shareData as any)?.edited ||
          (shareData as any)?.questions?.some(
            (item: any) =>
              (item?.original ?? "").trim() ||
              (item?.edited ?? "").trim() ||
              (item?.question ?? "").trim()
          )
      );

      if (!hasContent) {
        throw new Error("공유할 내용이 없습니다.");
      }

      if (isAuthenticated) {
        try {
          const response = await fetch("/api/editor/shares", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ data: shareData }),
          });

          if (!response.ok) {
            throw new Error(`Failed to save share: ${response.status}`);
          }

          const result = await response.json();
          const shareUrl: string | undefined = result?.url;
          const shareId: string | undefined = result?.id;

          if (!shareUrl || !shareId) {
            throw new Error("유효하지 않은 공유 응답입니다.");
          }

          saveShareHistory(shareData, shareUrl, {
            id: shareId,
            source: "remote",
          });

          showSuccess("공유 링크가 생성되었습니다.");
          return shareUrl;
        } catch (error) {
          console.error("원격 공유 생성 실패:", error);
          showError("서버 저장에 실패했습니다. 로컬 링크로 공유합니다.");
        }
      }

      const url = createShareUrl(shareData);
      const shareId = generateShareId();

      saveShareHistory(shareData, url, {
        id: shareId,
        source: "local",
      });

      showSuccess("공유 링크가 생성되었습니다.");
      return url;
    },
    [isAuthenticated, showSuccess, showError]
  );

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
