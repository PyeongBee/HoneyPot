"use client";

import { useEditorStore } from "@/stores/editorStore";
import { ViewMode } from "@/types/editor";

import { ModeButton } from "./ModeButton";

const modes: Array<{ mode: ViewMode; label: string }> = [
  { mode: "original", label: "원본" },
  { mode: "edit", label: "수정" },
  { mode: "result", label: "결과" },
];

export default function EditorMobileModeNav() {
  const { viewMode, setViewMode } = useEditorStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg z-[1100]">
      <div className="flex items-center justify-around px-2 py-3">
        {modes.map(modeItem => (
          <ModeButton
            key={modeItem.mode}
            variant="text"
            active={viewMode === modeItem.mode}
            onClick={() => setViewMode(modeItem.mode)}
            className="flex-1 text-center"
            aria-label={`${modeItem.label} 모드로 전환`}
          >
            {modeItem.label}
          </ModeButton>
        ))}
      </div>
    </nav>
  );
}
