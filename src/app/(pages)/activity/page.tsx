"use client";

import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import PageShell from "@/components/layout/PageShell";
import { useAuthStore } from "@/stores/authStore";
import { useConfirmStore } from "@/stores/confirmStore";
import { useToastStore } from "@/stores/toastStore";
import { ShareData, ShareHistory, isShareDataV2 } from "@/types/editor";
import { copyToClipboard } from "@/utils/clipboardUtils";
import {
  clearShareHistory,
  deleteShareHistory,
  generateShareTitle,
  getShareHistory,
} from "@/utils/shareHistoryUtils";
import { ExternalLink, Share2, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function ActivityPage() {
  const [shareHistory, setShareHistory] = useState<ShareHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showSuccess, showError } = useToastStore();
  const { showConfirm } = useConfirmStore();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const getSharePreview = useCallback((shareData: ShareData) => {
    if (isShareDataV2(shareData)) {
      const target =
        shareData.questions.find(q => q.id === shareData.activeQuestionId) ??
        shareData.questions[0];

      if (!target) {
        return "";
      }

      return target.edited || target.original || "";
    }

    return shareData.edited || shareData.original || "";
  }, []);

  const loadShareHistory = useCallback(async () => {
    setIsLoading(true);

    try {
      const localHistory = getShareHistory();
      let combinedHistory: ShareHistory[] = [...localHistory];

      if (isAuthenticated) {
        try {
          const response = await fetch(
            `/api/editor/shares?mine=1&_t=${Date.now()}`,
            {
              cache: "no-store",
              headers: {
                "Cache-Control": "no-cache",
                Pragma: "no-cache",
              },
            }
          );

          if (response.ok) {
            const payload = await response.json();
            const remoteShares = Array.isArray(payload?.shares)
              ? (payload.shares as Array<{
                  id: string;
                  createdAt: string;
                  data: ShareData;
                  url: string;
                }>)
              : [];

            const remoteHistory: ShareHistory[] = remoteShares.map(item => ({
              id: item.id,
              title: generateShareTitle(item.data),
              url: item.url,
              shareData: item.data,
              createdAt: item.createdAt,
              source: "remote",
            }));

            const historyMap = new Map<string, ShareHistory>();

            for (const entry of localHistory) {
              historyMap.set(entry.id, entry);
            }

            for (const entry of remoteHistory) {
              historyMap.set(entry.id, entry);
            }

            combinedHistory = Array.from(historyMap.values());
          } else if (response.status !== 401) {
            throw new Error(`원격 공유 기록 응답 코드: ${response.status}`);
          }
        } catch (error) {
          console.error("원격 공유 기록 로드 실패:", error);
          showError("서버 공유 기록을 불러오는데 실패했습니다.");
        }
      }

      combinedHistory.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setShareHistory(combinedHistory);
    } catch (error) {
      console.error("공유 기록 로드 실패:", error);
      showError("공유 기록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, showError]);

  useEffect(() => {
    void loadShareHistory();
  }, [loadShareHistory]);

  const handleCopyUrl = async (url: string) => {
    const result = await copyToClipboard(url);
    if (result.success) {
      showSuccess("링크가 클립보드에 복사되었습니다.");
    } else {
      showError(`링크 복사 실패: ${result.message}`);
    }
  };

  const handleDeleteItem = useCallback(
    async (item: ShareHistory) => {
      try {
        // 낙관적 업데이트: 먼저 UI에서 제거
        setShareHistory(prev => prev.filter(h => h.id !== item.id));

        if (item.source === "remote") {
          const response = await fetch(`/api/editor/shares/${item.id}`, {
            method: "DELETE",
            cache: "no-store",
          });

          if (!response.ok) {
            throw new Error(`원격 공유 삭제 실패: ${response.status}`);
          }
        } else {
          deleteShareHistory(item.id);
        }

        showSuccess("공유 기록이 삭제되었습니다.");

        // 서버와 동기화하기 위해 다시 로드
        await loadShareHistory();
      } catch (error) {
        console.error("공유 기록 삭제 실패:", error);
        showError("공유 기록 삭제에 실패했습니다.");
        // 실패 시 다시 로드
        await loadShareHistory();
      }
    },
    [loadShareHistory, showError, showSuccess]
  );

  const handleClearAll = useCallback(() => {
    showConfirm({
      message:
        "모든 로컬 공유 기록을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.",
      confirmText: "삭제",
      variant: "destructive",
      onConfirm: async () => {
        try {
          clearShareHistory();
          showSuccess("로컬 공유 기록이 삭제되었습니다.");
          await loadShareHistory();
        } catch (error) {
          console.error("모든 로컬 기록 삭제 실패:", error);
          showError("공유 기록 삭제에 실패했습니다.");
        }
      },
    });
  }, [loadShareHistory, showConfirm, showError, showSuccess]);

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

  const hasLocalEntries = shareHistory.some(item => item.source !== "remote");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <PageShell
      title="내 활동"
      className="min-h-screen dark:bg-gray-900 pb-8"
      contentClassName="max-w-4xl mx-auto px-4"
    >
      {/* 공유 기록 목록 */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            공유 기록
          </h2>
          {hasLocalEntries && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              ?? ?? ?? ??
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
            {shareHistory.map(item => {
              const previewText = getSharePreview(item.shareData);
              const sourceLabel = item.source === "remote" ? "서버" : "로컬";
              const sourceClassName =
                item.source === "remote"
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200"
                  : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200";

              return (
                <div
                  key={item.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {/* 데스크톱: 1행 5열 구조 */}
                  <div className="hidden md:grid md:grid-cols-5 gap-4 items-center mb-3">
                    {/* 1-3열: 질문 (3열 차지) */}
                    <div className="col-span-3">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate flex items-center gap-2">
                        <span className="truncate">{item.title}</span>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${sourceClassName}`}
                        >
                          {sourceLabel}
                        </span>
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
                          onClick={() => handleDeleteItem(item)}
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
                        <h3 className="text-base font-medium text-gray-900 dark:text-white truncate flex items-center gap-2">
                          <span className="truncate">{item.title}</span>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${sourceClassName}`}
                          >
                            {sourceLabel}
                          </span>
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
                            onClick={() => handleDeleteItem(item)}
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
                  {previewText && (
                    <div className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <p
                        className="text-sm text-gray-700 dark:text-gray-300 overflow-hidden"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {previewText}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </PageShell>
  );
}
