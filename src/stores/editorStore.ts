import { create } from "zustand";
import { devtools } from "zustand/middleware";

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
import { useToastStore } from "./toastStore";

type ShareLoadResult = {
  questions: EditorQuestionState[];
  activeQuestionId: string | null;
};

interface EditorState {
  // State
  questions: EditorQuestionState[];
  activeQuestionId: string;
  viewMode: ViewMode;

  // Actions
  setQuestions: (questions: EditorQuestionState[]) => void;
  setActiveQuestionId: (id: string) => void;
  setViewMode: (mode: ViewMode) => void;

  // Question Updates
  updateActiveQuestion: (
    updater: (question: EditorQuestionState) => EditorQuestionState
  ) => void;
  setOriginalText: (text: string) => void;
  setEditedText: (text: string) => void;
  setQuestionText: (text: string) => void;
  setQuestionCharLimit: (limit: number) => void;
  setMemos: (memos: Memo[]) => void;

  // Complex Actions
  addMemo: (memo: Memo) => void;
  deleteMemo: (memoId: string) => void;
  resetTexts: () => void;
  addQuestion: () => string;
  removeQuestion: (questionId: string) => void;
  loadSharedData: () => Promise<boolean>;
}

// 확장된 반환 타입 정의
interface EditorStore extends EditorState {
  originalText: string;
  editedText: string;
  questionText: string;
  questionCharLimit: number;
  memos: Memo[];
}

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

const initialQuestion = createQuestion({});

const useBaseEditorStore = create<EditorState>()(
  devtools((set, get) => ({
    questions: [initialQuestion],
    activeQuestionId: initialQuestion.id,
    viewMode: "original",

    setQuestions: questions => set({ questions }),
    setActiveQuestionId: activeQuestionId => set({ activeQuestionId }),
    setViewMode: viewMode => set({ viewMode }),

    updateActiveQuestion: updater =>
      set(state => ({
        questions: state.questions.map(q =>
          q.id === state.activeQuestionId ? updater(q) : q
        ),
      })),

    setOriginalText: text =>
      get().updateActiveQuestion(q => ({
        ...q,
        originalText: text,
      })),

    setEditedText: text =>
      get().updateActiveQuestion(q => ({
        ...q,
        editedText: text,
      })),

    setQuestionText: text =>
      get().updateActiveQuestion(q => ({
        ...q,
        questionText: text,
      })),

    setQuestionCharLimit: limit =>
      get().updateActiveQuestion(q => ({
        ...q,
        questionCharLimit: limit || DEFAULT_CHAR_LIMIT,
      })),

    setMemos: memos =>
      get().updateActiveQuestion(q => ({
        ...q,
        memos,
      })),

    addMemo: memo =>
      get().updateActiveQuestion(q => ({
        ...q,
        memos: [...q.memos, memo],
      })),

    deleteMemo: memoId =>
      get().updateActiveQuestion(q => ({
        ...q,
        memos: q.memos.filter(m => m.id !== memoId),
      })),

    resetTexts: () => {
      const question = createQuestion({});
      set({
        questions: [question],
        activeQuestionId: question.id,
        viewMode: "original",
      });
    },

    addQuestion: () => {
      const newQuestion = createQuestion({});
      set(state => ({
        questions: [...state.questions, newQuestion],
        activeQuestionId: newQuestion.id,
      }));
      return newQuestion.id;
    },

    removeQuestion: questionId => {
      set(state => {
        if (state.questions.length <= 1) return state;

        const activeId = state.activeQuestionId;
        const filtered = state.questions.filter(
          (q: EditorQuestionState) => q.id !== questionId
        );

        if (filtered.length === 0) {
          const newQ = createQuestion({});
          return {
            questions: [newQ],
            activeQuestionId: newQ.id,
          };
        } else {
          let newActiveId = activeId;
          if (
            activeId === questionId ||
            !filtered.some((q: EditorQuestionState) => q.id === activeId)
          ) {
            newActiveId = filtered[0].id;
          }

          return {
            questions: filtered,
            activeQuestionId: newActiveId,
          };
        }
      });
    },

    loadSharedData: async () => {
      const { showSuccess, showError } = useToastStore.getState();
      const urlParams = new URLSearchParams(window.location.search);

      const applyShare = (shareData: ShareData) => {
        const { questions: incomingQuestions, activeQuestionId: incomingId } =
          fromShareData(shareData);

        const normalizedQuestions = ensureQuestions(incomingQuestions);

        set({
          questions: normalizedQuestions,
          activeQuestionId:
            incomingId && normalizedQuestions.some(q => q.id === incomingId)
              ? incomingId
              : normalizedQuestions[0].id,
          viewMode: "result",
        });

        showSuccess("공유된 데이터를 불러왔습니다.");
        return true;
      };

      const handleDecodeFailure = () => {
        showError("공유 데이터를 불러오는데 실패했습니다.");
        return false;
      };

      const encodedData = urlParams.get("data");
      if (encodedData) {
        const shareData = decodeShareData(encodedData);
        if (shareData) {
          return applyShare(shareData);
        }
        return handleDecodeFailure();
      }

      const sharedId = urlParams.get("share");
      if (sharedId) {
        try {
          const response = await fetch(`/api/editor/shares/${sharedId}`);

          if (response.status === 401) {
            const errorData = await response.json();
            showError(
              errorData.error || "다문항 링크를 열려면 로그인이 필요합니다."
            );

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
  }))
);

// Derived state hook
export const useEditorStore = (): EditorStore => {
  const store = useBaseEditorStore();
  const activeQuestion =
    store.questions.find(q => q.id === store.activeQuestionId) ||
    store.questions[0];

  return {
    ...store,
    originalText: activeQuestion.originalText,
    editedText: activeQuestion.editedText,
    questionText: activeQuestion.questionText,
    questionCharLimit: activeQuestion.questionCharLimit,
    memos: activeQuestion.memos,
  };
};

// Export base store for non-hook usage if needed
export { useBaseEditorStore };
