"use client";

import { Button } from "@/components/common/Button";
import { InputField } from "@/components/common/Input";
import { ShareData } from "@/types/editor";
import { Check, Copy, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface ShareModalProps {
  isOpen: boolean;
  shareData: ShareData;
  onClose: () => void;
  onShare: (shareData: ShareData) => string; // 링크 생성 함수
  onCopy: (url: string) => Promise<boolean>; // 복사 함수
}

export default function ShareModal({
  isOpen,
  shareData,
  onClose,
  onShare,
  onCopy,
}: ShareModalProps) {
  const [shareUrl, setShareUrl] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // 모달이 열리면 링크 생성
  useEffect(() => {
    if (isOpen && !shareUrl) {
      try {
        const url = onShare(shareData);
        setShareUrl(url);
      } catch (error) {
        console.error("링크 생성 실패:", error);
      }
    }
  }, [isOpen, shareData, onShare, shareUrl]);

  // 모달이 닫히면 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      setShareUrl("");
      setIsCopied(false);
    }
  }, [isOpen]);

  const handleCopy = useCallback(async () => {
    if (shareUrl) {
      const success = await onCopy(shareUrl);
      if (success) {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    }
  }, [shareUrl, onCopy]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1100] p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            자소서 공유하기
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="모달 닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 링크 입력 및 복사 */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            공유 링크
          </label>
          <div className="flex gap-2">
            <InputField
              type="text"
              value={shareUrl}
              onChange={() => {}}
              readOnly
              className="flex-1 bg-gray-50 dark:bg-gray-700 text-sm font-mono"
              placeholder="링크 생성 중..."
            />
            <Button
              variant={isCopied ? "secondary" : "default"}
              onClick={handleCopy}
              className="whitespace-nowrap px-4"
              disabled={!shareUrl}
            >
              {isCopied ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  복사됨
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  복사
                </>
              )}
            </Button>
          </div>
        </div>

        {/* 안내 메시지 */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 이 링크를 통해 작성한 자소서를 다른 사람과 공유할 수 있습니다.
          </p>
        </div>

        {/* 닫기 버튼 */}
        <div className="mt-6 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
}
