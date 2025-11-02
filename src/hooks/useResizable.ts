/**
 * 드래그를 통한 크기 조정 Hook
 */

import { useCallback, useEffect, useRef, useState } from "react";

interface UseResizableOptions {
  minHeight?: number;
  maxHeight?: number;
  defaultHeight?: number;
  storageKey?: string; // 크기를 localStorage에 저장할 키
}

interface UseResizableReturn {
  height: number;
  isResizing: boolean;
  handleMouseDown: (e: React.MouseEvent) => void;
  resetHeight: () => void;
}

export function useResizable({
  minHeight = 200,
  maxHeight = 800,
  defaultHeight = 512, // h-128 (32rem = 512px)
  storageKey,
}: UseResizableOptions = {}): UseResizableReturn {
  // localStorage에서 저장된 높이 불러오기
  const getInitialHeight = () => {
    if (storageKey && typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed)) {
          return Math.max(minHeight, Math.min(maxHeight, parsed));
        }
      }
    }
    return defaultHeight;
  };

  const [height, setHeight] = useState(getInitialHeight);
  const [isResizing, setIsResizing] = useState(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  // 높이 변경 시 localStorage에 저장
  useEffect(() => {
    if (storageKey && typeof window !== "undefined") {
      localStorage.setItem(storageKey, height.toString());
    }
  }, [height, storageKey]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsResizing(true);
      startYRef.current = e.clientY;
      startHeightRef.current = height;
    },
    [height]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;

      const deltaY = e.clientY - startYRef.current;
      const newHeight = startHeightRef.current + deltaY;

      setHeight(Math.max(minHeight, Math.min(maxHeight, newHeight)));
    },
    [isResizing, minHeight, maxHeight]
  );

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resetHeight = useCallback(() => {
    setHeight(defaultHeight);
    if (storageKey && typeof window !== "undefined") {
      localStorage.removeItem(storageKey);
    }
  }, [defaultHeight, storageKey]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "ns-resize";
      document.body.style.userSelect = "none";

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return {
    height,
    isResizing,
    handleMouseDown,
    resetHeight,
  };
}
