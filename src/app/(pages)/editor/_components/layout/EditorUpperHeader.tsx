"use client";

import { Share2, Trash2 } from "lucide-react";

import PageTopBar from "@/components/layout/PageTopBar";
import { ViewMode } from "@/types/editor";

import EditorModeSelector from "./EditorModeSelector";

interface EditorUpperHeaderProps {
  viewMode: ViewMode;
  isMobile: boolean;
  isCollapsed: boolean;
  isHeaderVisible: boolean;
  isAuthenticated: boolean;
  canDeleteQuestion: boolean;
  onModeChange: (mode: ViewMode) => void;
  onMobileMenuClick?: () => void;
  onShareClick?: () => void;
  onDeleteClick?: () => void;
}

export default function EditorUpperHeader({
  viewMode,
  isMobile,
  isCollapsed,
  isHeaderVisible,
  isAuthenticated,
  canDeleteQuestion,
  onModeChange,
  onMobileMenuClick,
  onShareClick,
  onDeleteClick,
}: EditorUpperHeaderProps) {
  const mobileRightSlot = (
    <>
      {isAuthenticated && canDeleteQuestion && (
        <button
          type="button"
          className="p-2 rounded-full transition-colors hover:bg-gray-100 active:bg-gray-200"
          onClick={onDeleteClick}
          aria-label="문항 삭제"
        >
          <Trash2 className="w-5 h-5 text-gray-800" />
        </button>
      )}
      <button
        type="button"
        className="p-2 rounded-full transition-colors hover:bg-gray-100 active:bg-gray-200"
        onClick={onShareClick}
        aria-label="공유하기"
      >
        <Share2 className="w-5 h-5 text-gray-800" />
      </button>
    </>
  );

  const desktopCenterSlot = (
    <EditorModeSelector
      viewMode={viewMode}
      isMobile={isMobile}
      onModeChange={onModeChange}
    />
  );

  const desktopRightSlot = isAuthenticated && canDeleteQuestion && (
    <button
      type="button"
      className="p-2 rounded-full transition-colors hover:bg-gray-100 active:bg-gray-200"
      onClick={onDeleteClick}
      aria-label="문항 삭제"
    >
      <Trash2 className="w-5 h-5 text-gray-800" />
    </button>
  );

  return (
    <PageTopBar
      title="자소서 에디터"
      isMobile={isMobile}
      isCollapsed={isCollapsed}
      isHeaderVisible={isHeaderVisible}
      onMobileMenuClick={onMobileMenuClick}
      centerSlot={desktopCenterSlot}
      rightSlot={isMobile ? mobileRightSlot : desktopRightSlot}
    />
  );
}
