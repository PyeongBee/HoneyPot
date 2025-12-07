import React from "react";

import { MESSAGES } from "@/constants/messages";
import { useResizable } from "@/hooks/useResizable";
import { useEditorStore } from "@/stores/editorStore";

const OriginalEditor: React.FC = React.memo(function OriginalEditor() {
  const { originalText, setOriginalText } = useEditorStore();
  const { height, isResizing, handleMouseDown } = useResizable({
    minHeight: 200,
    maxHeight: 800,
    defaultHeight: 512,
    storageKey: "editor-original-height",
  });

  return (
    <div className="w-full h-full">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <label className="text-lg font-semibold text-gray-900 dark:text-white">
            {MESSAGES.LABELS.ORIGINAL_TITLE}
          </label>
        </div>
        <textarea
          className="w-full p-4 border-0 resize-none focus:outline-none focus:ring-0 
                 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          style={{ height: `${height}px` }}
          value={originalText}
          onChange={e => setOriginalText(e.target.value)}
          placeholder={MESSAGES.LABELS.ORIGINAL_PLACEHOLDER}
          aria-label={MESSAGES.LABELS.ORIGINAL_ARIA}
        />
        {/* 크기 조정 핸들 */}
        <div
          className={`
            h-2 cursor-ns-resize flex items-center justify-center
            hover:bg-blue-500 hover:bg-opacity-20 transition-colors
            border-t border-gray-200 dark:border-gray-700
            ${isResizing ? "bg-blue-500 bg-opacity-30" : ""}
          `}
          onMouseDown={handleMouseDown}
          title="드래그하여 크기 조정"
        >
          <div className="w-12 h-1 rounded-full bg-gray-400 dark:bg-gray-500" />
        </div>
      </div>
    </div>
  );
});

export default OriginalEditor;
