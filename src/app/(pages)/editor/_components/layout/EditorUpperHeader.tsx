"use client";

import { Share2, Trash2 } from "lucide-react";

import PageTopBar from "@/components/layout/PageTopBar";
import { useAuthStore } from "@/stores/authStore";
import { useDeviceStore } from "@/stores/deviceStore";
import { useEditorStore } from "@/stores/editorStore";
import { useLayoutStore } from "@/stores/layoutStore";
import { useSidebarStore } from "@/stores/sidebarStore";

import EditorModeSelector from "./EditorModeSelector";

interface EditorUpperHeaderProps {
  onMobileMenuClick?: () => void;
  onShareClick?: () => void;
  onDeleteClick?: () => void;
}

export default function EditorUpperHeader({
  onMobileMenuClick,
  onShareClick,
  onDeleteClick,
}: EditorUpperHeaderProps) {
  const { viewMode, setViewMode, questions } = useEditorStore();
  const { isAuthenticated } = useAuthStore();
  const { isMobile } = useDeviceStore();
  const { isHeaderHidden } = useLayoutStore();
  const { isCollapsed } = useSidebarStore();

  const canDeleteQuestion = questions.length > 1;
  const isHeaderVisible = !isHeaderHidden;

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
      onModeChange={setViewMode}
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
