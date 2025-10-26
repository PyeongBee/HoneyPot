"use client";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import Toast from "@/components/common/Toast";
import { useConfirmStore } from "@/stores/confirmStore";
import { ToastData, useToastStore } from "@/stores/toastStore";
import { ShareHistory } from "@/types/editor";
import { copyToClipboard } from "@/utils/clipboardUtils";
import {
  clearShareHistory,
  deleteShareHistory,
  getShareHistory,
} from "@/utils/shareHistoryUtils";
import { ExternalLink, Share2, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function ActivityPage() {
  const [shareHistory, setShareHistory] = useState<ShareHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toasts, showSuccess, showError, removeToast } = useToastStore();
  const { showConfirm } = useConfirmStore();

  const loadShareHistory = useCallback(() => {
    try {
      const history = getShareHistory();
      setShareHistory(history);
    } catch (error) {
      console.error("공유 기록 로드 실패:", error);
      showError("공유 기록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadShareHistory();
  }, [loadShareHistory]);

  const handleCopyUrl = async (url: string) => {
    const result = await copyToClipboard(url);
    if (result.success) {
      showSuccess("링크가 클립보드에 복사되었습니다.");
    } else {
      showError(`링크 복사 실패: ${result.message}`);
    }
  };

  const handleDeleteItem = (id: string) => {
    try {
      deleteShareHistory(id);
      loadShareHistory();
      showSuccess("공유 기록이 삭제되었습니다.");
    } catch (error) {
      console.error("공유 기록 삭제 실패:", error);
      showError("공유 기록 삭제에 실패했습니다.");
    }
  };

  const handleClearAll = () => {
    showConfirm({
      message:
        "모든 공유 기록을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.",
      confirmText: "삭제",
      variant: "destructive",
      onConfirm: () => {
        try {
          clearShareHistory();
          loadShareHistory();
          showSuccess("모든 공유 기록이 삭제되었습니다.");
        } catch (error) {
          console.error("공유 기록 전체 삭제 실패:", error);
          showError("공유 기록 삭제에 실패했습니다.");
        }
      },
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) {
      return "방금 전";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    } else if (diffInMinutes < 60 * 24) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}시간 전`;
    } else if (diffInMinutes < 60 * 24 * 7) {
      const days = Math.floor(diffInMinutes / (60 * 24));
      return `${days}일 전`;
    } else {
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            내 활동
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            공유한 자소서 작업 기록을 확인하고 관리하세요
          </p>
        </div>

        {/* 공유 기록 목록 */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              공유 기록
            </h2>
            {shareHistory.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                전체 삭제
              </Button>
            )}
          </div>

          {shareHistory.length === 0 ? (
            <div className="text-center py-12">
              <Share2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                공유 기록이 없습니다
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                에디터에서 자소서를 공유하면 여기에 기록이 나타납니다
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {shareHistory.map(item => (
                <div
                  key={item.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {/* 데스크톱: 1행 5열 구조 */}
                  <div className="hidden md:grid md:grid-cols-5 gap-4 items-center mb-3">
                    {/* 1-3열: 질문 (3열 차지) */}
                    <div className="col-span-3">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                        {item.title}
                      </h3>
                    </div>

                    {/* 4열: 시간 (우측 정렬) */}
                    <div className="col-span-1 text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(item.createdAt)}
                      </p>
                    </div>

                    {/* 5열: 버튼들 */}
                    <div className="col-span-1 flex items-center justify-end space-x-1">
                      <div title="링크 복사">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyUrl(item.url)}
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div title="새 탭에서 열기">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(item.url, "_blank")}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                      <div title="삭제">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* 모바일: 2행 구조 */}
                  <div className="md:hidden mb-3">
                    {/* 1행: 질문 3열 + 버튼들 2열 */}
                    <div className="grid grid-cols-5 gap-2 items-center mb-2">
                      {/* 질문 (3열) */}
                      <div className="col-span-3">
                        <h3 className="text-base font-medium text-gray-900 dark:text-white truncate">
                          {item.title}
                        </h3>
                      </div>

                      {/* 버튼들 (2열) */}
                      <div className="col-span-2 flex items-center justify-end space-x-1">
                        <div title="링크 복사">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyUrl(item.url)}
                            className="p-1.5"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                        <div title="새 탭에서 열기">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(item.url, "_blank")}
                            className="p-1.5"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                        <div title="삭제">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-red-600 hover:text-red-700 p-1.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* 2행: 시간 정보 */}
                    <div className="flex justify-start">
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {formatDate(item.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* 2행: 수정된 결과 (전체 너비) */}
                  {item.shareData.edited && (
                    <div className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <p
                        className="text-sm text-gray-700 dark:text-gray-300 overflow-hidden"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {item.shareData.edited}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* 토스트 메시지 */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toasts.map((toast: ToastData) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </div>
  );
}
