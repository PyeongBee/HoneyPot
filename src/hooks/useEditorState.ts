/**
 * 에디터 상태 관리 훅
 */

import { useCallback, useEffect, useState } from "react";
import { DEFAULT_CHAR_LIMIT } from "../constants/editor";
import { Memo, ViewMode } from "../types/editor";
import { decodeShareData } from "../utils/clipboardUtils";
import { getShareHistory } from "../utils/shareHistoryUtils";

export function useEditorState() {
  const [originalText, setOriginalText] = useState<string>("");
  const [editedText, setEditedText] = useState<string>("");
  const [questionText, setQuestionText] = useState<string>("");
  const [questionCharLimit, setQuestionCharLimit] =
    useState<number>(DEFAULT_CHAR_LIMIT);
  const [viewMode, setViewMode] = useState<ViewMode>("original");
  const [memos, setMemos] = useState<Memo[]>([]);
  const [isClient, setIsClient] = useState<boolean>(false);

  // 클라이언트 hydration 감지
  useEffect(() => {
    setIsClient(true);
  }, []);

  // URL 파라미터에서 공유 데이터 로드
  const loadSharedData = useCallback(
    (
      showSuccess: (message: string) => void,
      showError: (message: string) => void
    ) => {
      const urlParams = new URLSearchParams(window.location.search);

      // data 파라미터로 직접 공유된 경우
      const encodedData = urlParams.get("data");
      if (encodedData) {
        const shareData = decodeShareData(encodedData);
        if (shareData) {
          setOriginalText(shareData.original);
          setEditedText(shareData.edited);
          setQuestionText(shareData.question || "");
          setQuestionCharLimit(shareData.questionLimit || DEFAULT_CHAR_LIMIT);
          setMemos(shareData.memos || []);
          setViewMode("result");
          showSuccess("공유된 데이터를 불러왔습니다.");
          return true;
        } else {
          showError("공유 데이터를 불러오는데 실패했습니다.");
          return false;
        }
      }

      // share ID로 공유된 경우
      const sharedId = urlParams.get("share");
      if (sharedId) {
        const history = getShareHistory();
        const sharedData = history.find(item => item.id === sharedId);

      if (sharedData) {
        setOriginalText(sharedData.shareData.original);
        setEditedText(sharedData.shareData.edited);
        setQuestionText(sharedData.shareData.question || "");
        setQuestionCharLimit(
          sharedData.shareData.questionLimit || DEFAULT_CHAR_LIMIT
        );
        setMemos(sharedData.shareData.memos || []);
          setViewMode("result");
          showSuccess("공유된 데이터를 불러왔습니다.");
          return true;
        } else {
          showError("공유 ID를 찾을 수 없습니다.");
          return false;
        }
      }

      return false;
    },
    []
  );

  // 메모 추가
  const addMemo = useCallback((memo: Memo) => {
    setMemos(prev => [...prev, memo]);
  }, []);

  // 메모 삭제
  const deleteMemo = useCallback((memoId: string) => {
    setMemos(prev => prev.filter(memo => memo.id !== memoId));
  }, []);

  // 텍스트 초기화
  const resetTexts = useCallback(() => {
    setOriginalText("");
    setEditedText("");
    setQuestionText("");
    setMemos([]);
  }, []);

  return {
    // States
    originalText,
    editedText,
    questionText,
    questionCharLimit,
    viewMode,
    memos,
    isClient,

    // Setters
    setOriginalText,
    setEditedText,
    setQuestionText,
    setQuestionCharLimit,
    setViewMode,
    setMemos,

    // Actions
    loadSharedData,
    addMemo,
    deleteMemo,
    resetTexts,
  };
}
