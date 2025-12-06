import { useCallback, useEffect, useRef, useState } from "react";

import { SelectionInfo } from "../types/editor";

interface UseTextSelectionProps {
  onTextSelected: (selection: SelectionInfo) => void;
  onSelectionCleared: () => void;
  enabled?: boolean;
}

interface HighlightedRange {
  start: number;
  end: number;
}

const SELECTION_DELAY_MS = 10;
const REMOVED_DATA_ATTRIBUTE = "data-removed";
const START_INDEX_ATTRIBUTE = "data-start-index";
const INVALID_POSITION = -1;

/**
 * 텍스트 선택 기능을 관리하는 커스텀 훅
 * 사용자가 텍스트를 드래그하여 선택하면 메모 입력 UI를 표시합니다.
 */
export const useTextSelection = ({ 
  onTextSelected, 
  onSelectionCleared, 
  enabled = true 
}: UseTextSelectionProps) => {
  const [selectedText, setSelectedText] = useState<SelectionInfo | null>(null);
  const [showMemoInput, setShowMemoInput] = useState<boolean>(false);
  const [highlightedRange, setHighlightedRange] = useState<HighlightedRange | null>(null);
  const textRef = useRef<HTMLDivElement>(null);

  /**
   * 노드가 삭제된(removed) 요소 내부에 있는지 확인합니다.
   */
  const isInRemovedElement = useCallback((element: Element | null, rootElement: Element): boolean => {
    while (element && element !== rootElement) {
      if (element.getAttribute(REMOVED_DATA_ATTRIBUTE) === "true") {
        return true;
      }
      element = element.parentElement;
    }
    return false;
  }, []);

  /**
   * data-start-index 속성을 기준으로 텍스트 위치를 계산합니다.
   */
  const getPositionFromDataAttribute = useCallback((
    node: Node,
    offset: number,
    parentElement: Element
  ): number | null => {
    const dataStartIndex = parentElement.getAttribute(START_INDEX_ATTRIBUTE);
    if (dataStartIndex === null) {
      return null;
    }

    const baseIndex = parseInt(dataStartIndex, 10);
    const walker = document.createTreeWalker(parentElement, NodeFilter.SHOW_TEXT, null);
    
    let nodeOffset = 0;
    let currentNode = walker.nextNode();
    
    while (currentNode && currentNode !== node) {
      nodeOffset += currentNode.textContent?.length || 0;
      currentNode = walker.nextNode();
    }
    
    return baseIndex + nodeOffset + offset;
  }, []);

  /**
   * TreeWalker를 사용하여 전체 위치를 계산합니다.
   */
  const getPositionFromTreeWalker = useCallback((
    node: Node,
    offset: number,
    rootElement: Element
  ): number => {
    const walker = document.createTreeWalker(rootElement, NodeFilter.SHOW_TEXT, null);
    let position = 0;
    let currentNode = walker.nextNode();

    while (currentNode) {
      const isRemoved = isInRemovedElement(currentNode.parentElement, rootElement);

      if (currentNode === node) {
        return isRemoved ? INVALID_POSITION : position + offset;
      }
      
      if (!isRemoved) {
        position += currentNode.textContent?.length || 0;
      }
      
      currentNode = walker.nextNode();
    }

    return position;
  }, [isInRemovedElement]);

  /**
   * DOM 노드와 오프셋으로부터 텍스트 위치를 계산합니다.
   * data-start-index 속성을 우선적으로 사용하고, 없으면 TreeWalker로 계산합니다.
   */
  const getTextPosition = useCallback((node: Node, offset: number): number => {
    if (!textRef.current) {
      return 0;
    }

    const element = node.nodeType === Node.TEXT_NODE ? node.parentElement : (node as Element);
    
    // 삭제된 요소 내부인지 확인
    if (isInRemovedElement(element, textRef.current)) {
      return INVALID_POSITION;
    }

    // data-start-index 속성이 있으면 우선 사용
    const parentElement = node.nodeType === Node.TEXT_NODE ? node.parentElement : (node as Element);
    if (parentElement && parentElement !== textRef.current) {
      const position = getPositionFromDataAttribute(node, offset, parentElement);
      if (position !== null) {
        return position;
      }
    }

    // data-start-index가 없으면 TreeWalker로 계산
    return getPositionFromTreeWalker(node, offset, textRef.current);
  }, [isInRemovedElement, getPositionFromDataAttribute, getPositionFromTreeWalker]);

  /**
   * 사용자가 텍스트를 선택했을 때 처리하는 핸들러
   */
  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || !selection.toString().trim()) {
      return;
    }

    const text = selection.toString();
    const range = selection.getRangeAt(0);
    const startIndex = getTextPosition(range.startContainer, range.startOffset);
    const endIndex = getTextPosition(range.endContainer, range.endOffset);

    // 삭제된 부분을 선택한 경우 무시
    if (startIndex === INVALID_POSITION || endIndex === INVALID_POSITION) {
      return;
    }

    const selectionInfo: SelectionInfo = {
      text: text.trim(),
      startIndex,
      endIndex,
    };

    setSelectedText(selectionInfo);
    setHighlightedRange({ start: startIndex, end: endIndex });
    setShowMemoInput(true);
    onTextSelected(selectionInfo);
  }, [getTextPosition, onTextSelected]);

  /**
   * 텍스트 선택을 해제하는 핸들러
   */
  const handleClearSelection = useCallback(() => {
    setShowMemoInput(false);
    setSelectedText(null);
    setHighlightedRange(null);
    onSelectionCleared();
  }, [onSelectionCleared]);

  // 텍스트 선택 이벤트 리스너 등록
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleMouseUp = () => {
      setTimeout(handleTextSelection, SELECTION_DELAY_MS);
    };

    const currentTextRef = textRef.current;
    if (currentTextRef) {
      currentTextRef.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      if (currentTextRef) {
        currentTextRef.removeEventListener("mouseup", handleMouseUp);
      }
    };
  }, [handleTextSelection, enabled]);

  return {
    textRef,
    selectedText,
    showMemoInput,
    highlightedRange,
    handleClearSelection,
  };
};
