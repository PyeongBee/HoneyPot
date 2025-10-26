"use client";

import Toast from "@/components/common/Toast";
import {
  LazyDiffViewer,
  LazyEditor,
  LazyOriginalEditor,
  LazyQualityCheckSidebar,
  LazySpellCheckSidebar,
} from "@/components/lazy/index";
import { useEditorState } from "@/hooks/useEditorState";
import { useShareFeature } from "@/hooks/useShareFeature";
import { useTextCorrections } from "@/hooks/useTextCorrections";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { useConfirmStore } from "@/stores/confirmStore";
import { useDeviceStore } from "@/stores/deviceStore";
import { useSpellCheckStore } from "@/stores/spellCheckStore";
import { useToastStore } from "@/stores/toastStore";
import { getTextStats } from "@/utils/textUtils";
import { useCallback, useEffect, useState } from "react";
import EditorModeSelector from "../../(pages)/editor/_components/EditorModeSelector";
import EditorSidebar from "../../(pages)/editor/_components/EditorSidebar";

export const dynamic = "force-dynamic";

export default function EditorPage() {
  const { isMobile, checkDevice } = useDeviceStore();
  const { isSpellCheckMode } = useSpellCheckStore();
  const { toasts, showSuccess, showError, removeToast } = useToastStore();
  const { showConfirm } = useConfirmStore();

  // 에디터 상태
  const {
    originalText,
    editedText,
    questionText,
    questionCharLimit,
    viewMode,
    memos,
    isClient,
    setOriginalText,
    setEditedText,
    setQuestionText,
    setQuestionCharLimit,
    setViewMode,
    loadSharedData,
    addMemo,
    deleteMemo,
    resetTexts,
  } = useEditorState();

  const { shareUrl, isCopied, handleShare, handleCopyUrl } = useShareFeature(
    showSuccess,
    showError
  );

  const { applySpellCorrections, applyQualityCorrections } = useTextCorrections(
    {
      editedText,
      setEditedText,
      showSuccess,
      showError,
    }
  );

  // 품질 검사 모드
  const [isQualityCheckActive, setIsQualityCheckActive] =
    useState<boolean>(false);
  const [highlightedMemo, setHighlightedMemo] = useState<string | null>(null);

  // UI 상태
  const [isHeaderVisible, setIsHeaderVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);

  // 변경사항 감지
  useUnsavedChanges({ hasUnsavedChanges: !!(originalText || editedText) });

  // 클라이언트 초기화
  useEffect(() => {
    checkDevice();
    const handleResize = () => checkDevice();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [checkDevice]);

  useEffect(() => {
    if (isClient) {
      loadSharedData(showSuccess, showError);
    }
  }, [isClient, loadSharedData, showSuccess, showError]);

  // 헤더 표시/숨김 (스크롤)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsHeaderVisible(currentScrollY < lastScrollY || currentScrollY < 100);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // 모드 변경 핸들러
  const handleModeChange = useCallback(
    (mode: typeof viewMode) => {
      if (mode === "edit" && !originalText) {
        showError("원본 텍스트를 먼저 입력해주세요.");
        return;
      }

      if (mode === "result" && !originalText && !editedText) {
        showError("원본 또는 수정된 텍스트를 먼저 입력해주세요.");
        return;
      }

      setViewMode(mode);
    },
    [originalText, editedText, showError, setViewMode]
  );

  // 초기화 핸들러
  const handleReset = useCallback(() => {
    showConfirm({
      message: "모든 내용을 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
      onConfirm: () => {
        resetTexts();
        setViewMode("original");
        showSuccess("모든 내용이 초기화되었습니다.");
      },
    });
  }, [showConfirm, resetTexts, setViewMode, showSuccess]);

  // 메모 핸들러
  const handleMemoClick = useCallback((memo: (typeof memos)[0]) => {
    setHighlightedMemo(memo.id);
    setTimeout(() => setHighlightedMemo(null), 3000);
  }, []);

  const handleMemoHover = useCallback((memoId: string | null) => {
    setHighlightedMemo(memoId);
  }, []);

  // 품질 검사 핸들러
  const handleQualityCheckToggle = useCallback((isActive: boolean) => {
    setIsQualityCheckActive(isActive);
  }, []);

  const handleQualityCheckClose = useCallback(() => {
    setIsQualityCheckActive(false);
  }, []);

  const handleApplyQualityCorrections = useCallback(() => {
    applyQualityCorrections(() => setIsQualityCheckActive(false));
  }, [applyQualityCorrections]);

  // 공유 핸들러
  const handleShareClick = useCallback(() => {
    handleShare({
      original: originalText,
      edited: editedText,
      question: questionText,
      questionLimit: questionCharLimit,
      memos,
      timestamp: new Date().toISOString(),
    });
  }, [
    handleShare,
    originalText,
    editedText,
    questionText,
    questionCharLimit,
    memos,
  ]);

  // 통계 계산
  const originalStats = getTextStats(originalText, questionCharLimit);
  const editedStats = getTextStats(editedText, questionCharLimit);

  // 사이드바 렌더링
  const renderSidebar = () => {
    // 맞춤법 검사 모드
    if (viewMode === "edit" && isSpellCheckMode) {
      return (
        <LazySpellCheckSidebar onApplyCorrections={applySpellCorrections} />
      );
    }

    // 품질 검사 모드
    if (viewMode === "edit" && isQualityCheckActive) {
      return (
        <LazyQualityCheckSidebar
          onClose={handleQualityCheckClose}
          onApplyCorrections={handleApplyQualityCorrections}
        />
      );
    }

    return null;
  };

  // 클라이언트 사이드 렌더링 대기
  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* 모드 선택 */}
        <div className="mb-6">
          <EditorModeSelector
            viewMode={viewMode}
            isMobile={isMobile}
            onModeChange={handleModeChange}
          />
        </div>

        {/* 메인 콘텐츠 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 에디터 영역 */}
          <div className="md:col-span-2">
            {viewMode === "original" && (
              <LazyOriginalEditor
                originalText={originalText}
                onOriginalChange={setOriginalText}
              />
            )}

            {viewMode === "edit" && (
              <LazyEditor
                originalText={originalText}
                editedText={editedText}
                onEditedChange={setEditedText}
                onQualityCheckToggle={handleQualityCheckToggle}
              />
            )}

            {viewMode === "result" && (
              <LazyDiffViewer
                originalText={originalText}
                editedText={editedText}
                memos={memos}
                highlightedMemo={highlightedMemo}
                onAddMemo={addMemo}
              />
            )}
          </div>

          {/* 사이드바 영역 */}
          <div>
            <EditorSidebar
              viewMode={viewMode}
              isSpellCheckMode={isSpellCheckMode}
              isQualityCheckActive={isQualityCheckActive}
              originalText={originalText}
              editedText={editedText}
              questionText={questionText}
              questionCharLimit={questionCharLimit}
              memos={memos}
              isCopied={isCopied}
              shareUrl={shareUrl}
              originalStats={originalStats}
              editedStats={editedStats}
              onQuestionTextChange={setQuestionText}
              onQuestionCharLimitChange={setQuestionCharLimit}
              onAddMemo={addMemo}
              onDeleteMemo={deleteMemo}
              onMemoClick={handleMemoClick}
              onMemoHover={handleMemoHover}
              onShare={handleShareClick}
              onCopyUrl={handleCopyUrl}
              renderCheckSidebar={renderSidebar()}
            />
          </div>
        </div>
      </div>

      {/* 토스트 알림 */}
      {toasts.map((toast: Toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
