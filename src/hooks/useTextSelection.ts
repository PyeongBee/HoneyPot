import { useCallback, useEffect, useRef, useState } from "react";
import { SelectionInfo } from "../types/editor";

interface UseTextSelectionProps {
  onTextSelected: (selection: SelectionInfo) => void;
  onSelectionCleared: () => void;
  enabled?: boolean; // 텍스트 선택 기능 활성화 여부
}

export const useTextSelection = ({ onTextSelected, onSelectionCleared, enabled = true }: UseTextSelectionProps) => {
  const [selectedText, setSelectedText] = useState<SelectionInfo | null>(null);
  const [showMemoInput, setShowMemoInput] = useState<boolean>(false);
  const [highlightedRange, setHighlightedRange] = useState<{
    start: number;
    end: number;
  } | null>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // 텍스트 위치 계산 헬퍼 함수 (data-index 속성 우선 사용)
  const getTextPosition = useCallback((node: Node, offset: number): number => {
    if (!textRef.current) return 0;

    // 텍스트 노드의 부모 element를 찾음
    let element = node.nodeType === Node.TEXT_NODE ? node.parentElement : (node as Element);
    
    // data-removed="true"인 요소는 건너뜀
    while (element && element !== textRef.current) {
      if (element.getAttribute('data-removed') === 'true') {
        return -1; // removed 부분은 무시
      }
      element = element.parentElement;
    }

    // 현재 노드의 부모 요소에서 data-start-index 확인
    let parentElement = node.nodeType === Node.TEXT_NODE ? node.parentElement : (node as Element);
    if (parentElement && parentElement !== textRef.current) {
      const dataStartIndex = parentElement.getAttribute('data-start-index');
      if (dataStartIndex !== null) {
        // data-start-index가 있으면 그것을 기준으로 계산
        const baseIndex = parseInt(dataStartIndex);
        
        // 현재 노드가 부모 요소 내에서 몇 번째 문자인지 계산
        const walker = document.createTreeWalker(
          parentElement,
          NodeFilter.SHOW_TEXT,
          null
        );
        
        let nodeOffset = 0;
        let currentNode = walker.nextNode();
        
        while (currentNode && currentNode !== node) {
          nodeOffset += currentNode.textContent?.length || 0;
          currentNode = walker.nextNode();
        }
        
        return baseIndex + nodeOffset + offset;
      }
    }

    // data-start-index가 없으면 TreeWalker로 전체 위치 계산
    const walker = document.createTreeWalker(textRef.current, NodeFilter.SHOW_TEXT, null);

    let position = 0;
    let currentNode = walker.nextNode();

    while (currentNode) {
      // 현재 텍스트 노드의 부모 요소 확인
      let parentElement = currentNode.parentElement;
      
      // data-removed인 요소는 건너뜀
      let isRemoved = false;
      while (parentElement && parentElement !== textRef.current) {
        if (parentElement.getAttribute('data-removed') === 'true') {
          isRemoved = true;
          break;
        }
        parentElement = parentElement.parentElement;
      }

      if (currentNode === node) {
        if (isRemoved) return -1;
        return position + offset;
      }
      
      if (!isRemoved) {
        position += currentNode.textContent?.length || 0;
      }
      
      currentNode = walker.nextNode();
    }

    return position;
  }, []);

  // 텍스트 선택 핸들러
  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const text = selection.toString();
      const range = selection.getRangeAt(0);
      const startIndex = getTextPosition(range.startContainer, range.startOffset);
      const endIndex = getTextPosition(range.endContainer, range.endOffset);

      // removed 부분을 선택한 경우 무시
      if (startIndex === -1 || endIndex === -1) {
        return;
      }

      // 디버깅: 선택 정보 출력
      console.log('텍스트 선택:', {
        text: text,
        textLength: text.length,
        startIndex,
        endIndex,
        calculatedLength: endIndex - startIndex
      });

      const selectionInfo: SelectionInfo = {
        text: text.trim(),
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
    // enabled가 false면 이벤트 리스너를 등록하지 않음
    if (!enabled) {
      return;
    }

    const handleMouseUp = () => {
      setTimeout(handleTextSelection, 10);
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
