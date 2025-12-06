/**
 * 에디터 상태 관리 훅
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { DEFAULT_CHAR_LIMIT } from "../constants/editor";
import {
  EditorQuestionState,
  Memo,
  ShareData,
  ShareDataV1,
  ShareDataV2,
  ViewMode,
  isShareDataV2,
} from "../types/editor";
import { decodeShareData } from "../utils/clipboardUtils";
import { getShareHistory } from "../utils/shareHistoryUtils";

type ShareLoadResult = {
  questions: EditorQuestionState[];
  activeQuestionId: string | null;
};

const createQuestionId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `question_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

const createQuestion = (
  overrides?: Partial<EditorQuestionState>
): EditorQuestionState => ({
  id: overrides?.id ?? createQuestionId(),
  questionText: overrides?.questionText ?? "",
  questionCharLimit: overrides?.questionCharLimit ?? DEFAULT_CHAR_LIMIT,
  originalText: overrides?.originalText ?? "",
  editedText: overrides?.editedText ?? "",
  memos: overrides?.memos ?? [],
});

const ensureQuestions = (
  questions: EditorQuestionState[]
): EditorQuestionState[] => {
  if (questions.length === 0) {
    return [createQuestion({})];
  }

  return questions;
};

const fromShareData = (shareData: ShareData): ShareLoadResult => {
  if (isShareDataV2(shareData)) {
    return fromShareDataV2(shareData);
  }

  return fromShareDataV1(shareData as ShareDataV1);
};

const fromShareDataV1 = (shareData: ShareDataV1): ShareLoadResult => {
  const question = createQuestion({
    questionText: shareData.question ?? "",
    questionCharLimit: shareData.questionLimit ?? DEFAULT_CHAR_LIMIT,
    originalText: shareData.original ?? "",
    editedText: shareData.edited ?? "",
    memos: shareData.memos ?? [],
  });

  return {
    questions: [question],
    activeQuestionId: question.id,
  };
};

const fromShareDataV2 = (shareData: ShareDataV2): ShareLoadResult => {
  const questions = shareData.questions.map(question =>
    createQuestion({
      id: question.id,
      questionText: question.question ?? "",
      questionCharLimit: question.questionLimit ?? DEFAULT_CHAR_LIMIT,
      originalText: question.original ?? "",
      editedText: question.edited ?? "",
      memos: question.memos ?? [],
    })
  );

  const ensuredQuestions = ensureQuestions(questions);
  const activeIdCandidate = shareData.activeQuestionId;
  const hasActive = ensuredQuestions.some(q => q.id === activeIdCandidate);

  return {
    questions: ensuredQuestions,
    activeQuestionId: hasActive ? activeIdCandidate : ensuredQuestions[0].id,
  };
};

export function useEditorState() {
  const initialQuestionRef = useRef<EditorQuestionState | null>(null);
  if (!initialQuestionRef.current) {
    initialQuestionRef.current = createQuestion({});
  }
  const initialQuestion = initialQuestionRef.current;

  const [questions, setQuestions] = useState<EditorQuestionState[]>(() => [
    initialQuestion,
  ]);
  const [activeQuestionId, setActiveQuestionId] = useState<string>(
    initialQuestion.id
  );
  const [viewMode, setViewMode] = useState<ViewMode>("original");
  const [isClient, setIsClient] = useState<boolean>(false);

  const activeQuestion = useMemo(() => {
    return (
      questions.find(question => question.id === activeQuestionId) ??
      questions[0]
    );
  }, [questions, activeQuestionId]);

  // 클라이언트 hydration 감지
  useEffect(() => {
    setIsClient(true);
  }, []);

  const updateActiveQuestion = useCallback(
    (updater: (question: EditorQuestionState) => EditorQuestionState) => {
      setQuestions(prevQuestions =>
        prevQuestions.map(question =>
          question.id === activeQuestionId ? updater(question) : question
        )
      );
    },
    [activeQuestionId]
  );

  // URL 파라미터에서 공유 데이터 로드
  const loadSharedData = useCallback(
    async (
      showSuccess: (message: string) => void,
      showError: (message: string) => void
    ) => {
      const urlParams = new URLSearchParams(window.location.search);

      const applyShare = (shareData: ShareData) => {
        const { questions: incomingQuestions, activeQuestionId: incomingId } =
          fromShareData(shareData);

        const normalizedQuestions = ensureQuestions(incomingQuestions);
        setQuestions(normalizedQuestions);
        setActiveQuestionId(
          incomingId && normalizedQuestions.some(q => q.id === incomingId)
            ? incomingId
            : normalizedQuestions[0].id
        );
        setViewMode("result");
        showSuccess("공유된 데이터를 불러왔습니다.");
        return true;
      };

      const handleDecodeFailure = () => {
        showError("공유 데이터를 불러오는데 실패했습니다.");
        return false;
      };

      // data 파라미터로 직접 공유된 경우
      const encodedData = urlParams.get("data");
      if (encodedData) {
        const shareData = decodeShareData(encodedData);
        if (shareData) {
          return applyShare(shareData);
        }
        return handleDecodeFailure();
      }

      // share ID로 공유된 경우 (Supabase or local fallback)
      const sharedId = urlParams.get("share");
      if (sharedId) {
        try {
          const response = await fetch(`/api/editor/shares/${sharedId}`);
          
          // 401 응답: 인증 필요
          if (response.status === 401) {
            const errorData = await response.json();
            showError(errorData.error || "다문항 링크를 열려면 로그인이 필요합니다.");
            
            // 현재 URL을 redirectTo 파라미터로 전달하여 로그인 페이지로 이동
            const currentUrl = window.location.href;
            const loginUrl = `/login?redirectTo=${encodeURIComponent(currentUrl)}`;
            window.location.href = loginUrl;
            return false;
          }
          
          if (response.ok) {
            const payload = await response.json();
            const shareData: ShareData | undefined =
              payload?.share?.data ?? payload?.data;

            if (shareData) {
              return applyShare(shareData);
            }
          }
        } catch (error) {
          console.error("원격 공유 데이터 로드 실패:", error);
        }

        // 로컬 히스토리 폴백
        const history = getShareHistory();
        const sharedData = history.find(item => item.id === sharedId);

        if (sharedData) {
          return applyShare(sharedData.shareData);
        }

        showError("공유 ID를 찾을 수 없습니다.");
        return false;
      }

      return false;
    },
    []
  );

  // 메모 추가
  const addMemo = useCallback(
    (memo: Memo) => {
      updateActiveQuestion(question => ({
        ...question,
        memos: [...question.memos, memo],
      }));
    },
    [updateActiveQuestion]
  );

  // 메모 삭제
  const deleteMemo = useCallback(
    (memoId: string) => {
      updateActiveQuestion(question => ({
        ...question,
        memos: question.memos.filter(memo => memo.id !== memoId),
      }));
    },
    [updateActiveQuestion]
  );

  // 텍스트 초기화
  const resetTexts = useCallback(() => {
    const question = createQuestion({});
    setQuestions([question]);
    setActiveQuestionId(question.id);
    setViewMode("original");
  }, []);

  const setOriginalText = useCallback(
    (text: string) => {
      updateActiveQuestion(question => ({
        ...question,
        originalText: text,
      }));
    },
    [updateActiveQuestion]
  );

  const setEditedText = useCallback(
    (text: string) => {
      updateActiveQuestion(question => ({
        ...question,
        editedText: text,
      }));
    },
    [updateActiveQuestion]
  );

  const setQuestionText = useCallback(
    (text: string) => {
      updateActiveQuestion(question => ({
        ...question,
        questionText: text,
      }));
    },
    [updateActiveQuestion]
  );

  const setQuestionCharLimit = useCallback(
    (limit: number) => {
      updateActiveQuestion(question => ({
        ...question,
        questionCharLimit: limit || DEFAULT_CHAR_LIMIT,
      }));
    },
    [updateActiveQuestion]
  );

  const setMemos = useCallback(
    (memos: Memo[]) => {
      updateActiveQuestion(question => ({
        ...question,
        memos,
      }));
    },
    [updateActiveQuestion]
  );

  const addQuestion = useCallback(() => {
    const newQuestion = createQuestion({});
    setQuestions(prev => [...prev, newQuestion]);
    setActiveQuestionId(newQuestion.id);
    return newQuestion.id;
  }, []);

  const removeQuestion = useCallback(
    (questionId: string) => {
      setQuestions(prev => {
        if (prev.length <= 1) {
          return prev;
        }

        const filtered = prev.filter(question => question.id !== questionId);
        const ensured = ensureQuestions(filtered);

        if (!ensured.some(question => question.id === activeQuestionId)) {
          setActiveQuestionId(ensured[0].id);
        }

        return ensured;
      });
    },
    [activeQuestionId]
  );

  return {
    // States
    questions,
    activeQuestionId,
    viewMode,
    isClient,

    originalText: activeQuestion?.originalText ?? "",
    editedText: activeQuestion?.editedText ?? "",
    questionText: activeQuestion?.questionText ?? "",
    questionCharLimit: activeQuestion?.questionCharLimit ?? DEFAULT_CHAR_LIMIT,
    memos: activeQuestion?.memos ?? [],

    // Setters
    setOriginalText,
    setEditedText,
    setQuestionText,
    setQuestionCharLimit,
    setViewMode,
    setMemos,
    setActiveQuestionId,

    // Actions
    loadSharedData,
    addMemo,
    deleteMemo,
    resetTexts,
    addQuestion,
    removeQuestion,
  };
}
