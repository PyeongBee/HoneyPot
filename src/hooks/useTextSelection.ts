import { useState, useCallback, useRef, useEffect } from "react";
import { SelectionInfo } from "../types/editor";

interface UseTextSelectionProps {
  onTextSelected: (selection: SelectionInfo) => void;
  onSelectionCleared: () => void;
}

export const useTextSelection = ({ onTextSelected, onSelectionCleared }: UseTextSelectionProps) => {
  const [selectedText, setSelectedText] = useState<SelectionInfo | null>(null);
  const [showMemoInput, setShowMemoInput] = useState<boolean>(false);
  const [highlightedRange, setHighlightedRange] = useState<{
    start: number;
    end: number;
  } | null>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // 텍스트 위치 계산 헬퍼 함수
  const getTextPosition = useCallback((node: Node, offset: number): number => {
    if (!textRef.current) return 0;

    const walker = document.createTreeWalker(textRef.current, NodeFilter.SHOW_TEXT, null);

    let position = 0;
    let currentNode = walker.nextNode();

    while (currentNode) {
      if (currentNode === node) {
        return position + offset;
      }
      position += currentNode.textContent?.length || 0;
      currentNode = walker.nextNode();
    }

    return position;
  }, []);

  // 텍스트 선택 핸들러
  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const text = selection.toString().trim();
      const range = selection.getRangeAt(0);
      const startIndex = getTextPosition(range.startContainer, range.startOffset);
      const endIndex = getTextPosition(range.endContainer, range.endOffset);

      const selectionInfo: SelectionInfo = {
        text,
        startIndex,
        endIndex,
      };

      setSelectedText(selectionInfo);
      setHighlightedRange({ start: startIndex, end: endIndex });
      setShowMemoInput(true);
      onTextSelected(selectionInfo);
    }
  }, [getTextPosition, onTextSelected]);

  // 선택 해제 핸들러
  const handleClearSelection = useCallback(() => {
    setShowMemoInput(false);
    setSelectedText(null);
    setHighlightedRange(null);
    onSelectionCleared();
  }, [onSelectionCleared]);

  // 이벤트 리스너 등록
  useEffect(() => {
    const handleMouseUp = () => {
      setTimeout(handleTextSelection, 10);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (showMemoInput && !(event.target as Element).closest(".memo-input-container")) {
        handleClearSelection();
      }
    };

    const currentTextRef = textRef.current;
    if (currentTextRef) {
      currentTextRef.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      if (currentTextRef) {
        currentTextRef.removeEventListener("mouseup", handleMouseUp);
      }
      document.removeEventListener("click", handleClickOutside);
    };
  }, [handleTextSelection, handleClearSelection, showMemoInput]);

  return {
    textRef,
    selectedText,
    showMemoInput,
    highlightedRange,
    handleClearSelection,
  };
};
