"use client";

import Sidebar from "@/components/layout/Sidebar";
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
import { useAuthStore } from "@/stores/authStore";
import { useConfirmStore } from "@/stores/confirmStore";
import { useDeviceStore } from "@/stores/deviceStore";
import { useSidebarStore } from "@/stores/sidebarStore";
import { useSpellCheckStore } from "@/stores/spellCheckStore";
import { useToastStore } from "@/stores/toastStore";
import { SHARE_DATA_VERSION } from "@/types/editor";
import { getTextStats } from "@/utils/textUtils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import EditorMobileModeNav from "./_components/layout/EditorMobileModeNav";
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
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] =
    useState<boolean>(false);
  const lastScrollYRef = useRef<number>(0);

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
      .map(
        question =>
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
    lastScrollYRef.current =
      window.pageYOffset || document.documentElement.scrollTop || 0;

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const currentScrollY =
          window.pageYOffset || document.documentElement.scrollTop || 0;
        const lastY = lastScrollYRef.current;
        const isNearTop = currentScrollY < 80;
        const isScrollingUp = currentScrollY < lastY;

        setIsHeaderVisible(isNearTop || isScrollingUp);
        lastScrollYRef.current = currentScrollY;
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const handleOpenMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(true);
  }, []);

  const handleCloseMobileSidebar = useCallback(() => {
    setIsMobileSidebarOpen(false);
  }, []);

  // 모바일 사이드바 오버레이 시 스크롤 잠금
  useEffect(() => {
    if (!isMobile) return;
    const originalOverflow = document.body.style.overflow;
    if (isMobileSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalOverflow;
    }
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobileSidebarOpen, isMobile]);

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

  const checkSidebar = renderSidebar();
  const showCheckSidebar = Boolean(checkSidebar);
  const showResultSidebar = viewMode === "result";
  const hasRightColumn = showCheckSidebar || showResultSidebar;

  return (
    <div
      className={`min-h-screen dark:bg-gray-900 ${
        isMobile ? "pb-28" : "pb-16 md:pb-0"
      }`}
    >
      <EditorUpperHeader
        viewMode={viewMode}
        isMobile={isMobile}
        isCollapsed={isCollapsed}
        isHeaderVisible={isHeaderVisible}
        onModeChange={handleModeChange}
        onMobileMenuClick={handleOpenMobileSidebar}
        onShareClick={handleShareButtonClick}
      />

      {/* 모바일 사이드바 오버레이 (항상 렌더 후 트랜지션) */}
      {isMobile && (
        <div
          className={`fixed inset-0 z-[1200] bg-black/45 backdrop-blur-[1px] transition-opacity duration-200 ${
            isMobileSidebarOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={handleCloseMobileSidebar}
        >
          <div
            className={`absolute inset-y-0 left-0 w-64 max-w-[80vw] bg-white dark:bg-gray-900 shadow-xl transition-transform duration-200 ease-out ${
              isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            onClick={e => e.stopPropagation()}
          >
            <Sidebar
              isCollapsed={false}
              onToggle={handleCloseMobileSidebar}
              onNavigate={handleCloseMobileSidebar}
            />
          </div>
        </div>
      )}

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
        originalStats={originalStats}
        editedStats={editedStats}
        containerClassName={isAuthenticated ? "mt-4" : undefined}
      />

      <div className="max-w-7xl mx-auto">
        <div
          className={`grid grid-cols-1 ${
            hasRightColumn ? "md:grid-cols-4" : "md:grid-cols-1"
          } gap-2 mt-3`}
        >
          <div className={hasRightColumn ? "md:col-span-3" : "md:col-span-4"}>
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

          {hasRightColumn && (
            <div className="md:col-span-1">
              {showCheckSidebar ? (
                <div className="sticky top-24">{checkSidebar}</div>
              ) : (
                <EditorSidebar
                  viewMode={viewMode}
                  memos={memos}
                  originalStats={originalStats}
                  editedStats={editedStats}
                  onDeleteMemo={deleteMemo}
                  onMemoClick={handleMemoClick}
                  onMemoHover={handleMemoHover}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {!isMobile && (
        <ShareButton isMobile={isMobile} onClick={handleShareButtonClick} />
      )}

      {isMobile && (
        <EditorMobileModeNav
          viewMode={viewMode}
          onModeChange={handleModeChange}
        />
      )}

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
