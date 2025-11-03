"use client";

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
import { SHARE_DATA_VERSION } from "@/types/editor";
import { useAuthStore } from "@/stores/authStore";
import { useConfirmStore } from "@/stores/confirmStore";
import { useDeviceStore } from "@/stores/deviceStore";
import { useSidebarStore } from "@/stores/sidebarStore";
import { useSpellCheckStore } from "@/stores/spellCheckStore";
import { useToastStore } from "@/stores/toastStore";
import { getTextStats } from "@/utils/textUtils";
import { useCallback, useEffect, useMemo, useState } from "react";
import EditorSidebar from "./_components/layout/EditorSidebar";
import EditorUpperHeader from "./_components/layout/EditorUpperHeader";
import QuestionEditor from "./_components/QuestionEditor";
import QuestionTabs from "./_components/QuestionTabs";
import ShareButton from "./_components/ShareButton";
import ShareModal from "./_components/ShareModal";

export const dynamic = "force-dynamic";

export default function EditorPage() {
  const { isMobile, checkDevice } = useDeviceStore();
  const { isSpellCheckMode } = useSpellCheckStore();
  const { showSuccess, showError } = useToastStore();
  const { showConfirm } = useConfirmStore();
  const { isCollapsed } = useSidebarStore();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const {
    questions,
    activeQuestionId,
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
    setActiveQuestionId,
    loadSharedData,
    addMemo,
    deleteMemo,
    addQuestion,
    removeQuestion,
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
  useEffect(() => {
    setHighlightedMemo(null);
  }, [activeQuestionId]);

  // UI 상태
  const [isHeaderVisible, setIsHeaderVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  const hasUnsavedChanges = useMemo(
    () =>
      questions.some(question =>
        `${question.originalText}${question.editedText}${question.questionText}`.trim()
      ),
    [questions]
  );

  // 변경사항 감지
  useUnsavedChanges({ hasUnsavedChanges });

  // 클라이언트 초기화
  useEffect(() => {
    checkDevice();
    const handleResize = () => checkDevice();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [checkDevice]);

  useEffect(() => {
    if (!isClient) {
      return;
    }

    const combinedContent = questions
      .map(question =>
        `${question.questionText ?? ""}${question.originalText ?? ""}${question.editedText ?? ""}`
      )
      .join(" ")
      .trim();

    if (combinedContent) {
      sessionStorage.setItem("editorContent", combinedContent);
    } else {
      sessionStorage.removeItem("editorContent");
    }
  }, [questions, isClient]);

  useEffect(() => {
    if (isClient) {
      void loadSharedData(showSuccess, showError);
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
    [setViewMode]
  );

  const handleQuestionLimitChange = useCallback(
    (limit: number) => {
      setQuestionCharLimit(limit);
    },
    [setQuestionCharLimit]
  );

  // 문항 변경 핸들러
  const handleQuestionChange = useCallback(
    (text: string) => {
      setQuestionText(text);
    },
    [setQuestionText]
  );

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
    const hasContent = questions.some(question =>
      `${question.originalText}${question.editedText}${question.questionText}`.trim()
    );

    if (!hasContent) {
      showError("공유할 내용이 없습니다.");
      return;
    }
    setIsShareModalOpen(true);
  }, [questions, showError]);

  const handleCloseShareModal = useCallback(() => {
    setIsShareModalOpen(false);
  }, []);

  const handleSelectQuestion = useCallback(
    (questionId: string) => {
      setActiveQuestionId(questionId);
    },
    [setActiveQuestionId]
  );

  const handleAddQuestion = useCallback(() => {
    addQuestion();
    setViewMode("original");
  }, [addQuestion, setViewMode]);

  const handleRemoveQuestion = useCallback(
    (questionId: string) => {
      removeQuestion(questionId);
    },
    [removeQuestion]
  );

  const sharePayload = useMemo(
    () => ({
      version: SHARE_DATA_VERSION,
      timestamp: new Date().toISOString(),
      activeQuestionId,
      questions: questions.map(question => ({
        id: question.id,
        question: question.questionText,
        questionLimit: question.questionCharLimit,
        original: question.originalText,
        edited: question.editedText,
        memos: question.memos,
      })),
    }),
    [questions, activeQuestionId]
  );

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

      {isAuthenticated && (
        <div className="mt-20">
          <QuestionTabs
            questions={questions}
            activeQuestionId={activeQuestionId}
            onSelect={handleSelectQuestion}
            onAdd={handleAddQuestion}
            onRemove={handleRemoveQuestion}
          />
        </div>
      )}

      <QuestionEditor
        viewMode={viewMode}
        questionText={questionText}
        questionCharLimit={questionCharLimit}
        onQuestionChange={handleQuestionChange}
        onQuestionLimitChange={handleQuestionLimitChange}
        containerClassName={isAuthenticated ? "mt-4" : undefined}
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
        shareData={sharePayload}
        onClose={handleCloseShareModal}
        onShare={createShare}
        onCopy={copyShareUrl}
      />
    </div>
  );
}
