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
import { useSidebarStore } from "@/stores/sidebarStore";
import { useSpellCheckStore } from "@/stores/spellCheckStore";
import { ToastData, useToastStore } from "@/stores/toastStore";
import { getTextStats } from "@/utils/textUtils";
import { useCallback, useEffect, useState } from "react";
import EditorSidebar from "./_components/layout/EditorSidebar";
import EditorUpperHeader from "./_components/layout/EditorUpperHeader";
import QuestionEditor from "./_components/QuestionEditor";
import ShareButton from "./_components/ShareButton";
import ShareModal from "./_components/ShareModal";

export const dynamic = "force-dynamic";

export default function EditorPage() {
  const { isMobile, checkDevice } = useDeviceStore();
  const { isSpellCheckMode } = useSpellCheckStore();
  const { toasts, showSuccess, showError, removeToast } = useToastStore();
  const { showConfirm } = useConfirmStore();
  const { isCollapsed } = useSidebarStore();

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

  const { createShare, copyShareUrl } = useShareFeature(showSuccess, showError);

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
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

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
      setViewMode(mode);
    },
    [originalText, editedText, showError, setViewMode]
  );

  const handleQuestionLimitChange = (limit: number) => {
    setQuestionCharLimit(limit);
  };

  // 문항 변경 핸들러
  const handleQuestionChange = (text: string) => {
    setQuestionText(text);
    const totalContent = originalText + editedText + text;
    if (totalContent.trim()) {
      sessionStorage.setItem("editorContent", totalContent);
    } else {
      sessionStorage.removeItem("editorContent");
    }
  };

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
  const handleShareButtonClick = useCallback(() => {
    if (!originalText && !editedText) {
      showError("공유할 내용이 없습니다.");
      return;
    }
    setIsShareModalOpen(true);
  }, [originalText, editedText, showError]);

  const handleCloseShareModal = useCallback(() => {
    setIsShareModalOpen(false);
  }, []);

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
      <EditorUpperHeader
        viewMode={viewMode}
        isMobile={isMobile}
        isCollapsed={isCollapsed}
        isHeaderVisible={isHeaderVisible}
        onModeChange={handleModeChange}
      />

      <QuestionEditor
        viewMode={viewMode}
        questionText={questionText}
        questionCharLimit={questionCharLimit}
        onQuestionChange={handleQuestionChange}
        onQuestionLimitChange={handleQuestionLimitChange}
      />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-3">
          <div className="md:col-span-3">
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

          <div className="md:col-span-1">
            <EditorSidebar
              viewMode={viewMode}
              memos={memos}
              originalStats={originalStats}
              editedStats={editedStats}
              onDeleteMemo={deleteMemo}
              onMemoClick={handleMemoClick}
              onMemoHover={handleMemoHover}
              renderCheckSidebar={renderSidebar()}
            />
          </div>
        </div>
      </div>

      <ShareButton isMobile={isMobile} onClick={handleShareButtonClick} />

      <ShareModal
        isOpen={isShareModalOpen}
        shareData={{
          original: originalText,
          edited: editedText,
          question: questionText,
          questionLimit: questionCharLimit,
          memos,
          timestamp: new Date().toISOString(),
        }}
        onClose={handleCloseShareModal}
        onShare={createShare}
        onCopy={copyShareUrl}
      />

      {toasts.map((toast: ToastData) => (
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
