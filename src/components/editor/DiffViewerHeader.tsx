import React, { useState, useCallback } from "react";
import { copyToClipboard } from "../../utils/clipboardUtils";
import { COPY_SUCCESS_DURATION } from "../../constants/editor";
import ToggleSwitch from "../common/ToggleSwitch";

interface DiffViewerHeaderProps {
  viewMode: "diff" | "final";
  onViewModeChange: (mode: "diff" | "final") => void;
  editedText: string;
}

const DiffViewerHeader: React.FC<DiffViewerHeaderProps> = React.memo(function DiffViewerHeader({
  viewMode,
  onViewModeChange,
  editedText,
}) {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopyResult = useCallback(async () => {
    const result = await copyToClipboard(editedText);
    if (result.success) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), COPY_SUCCESS_DURATION);
    } else {
      console.error("복사 실패:", result.message);
    }
  }, [editedText]);

  return (
    <div className="flex justify-between items-center px-4 py-4 border-b border-gray-200 dark:border-gray-700">
      <label className="text-lg font-semibold text-gray-900 dark:text-white">최종 결과</label>
      <div className="flex items-center gap-4">
        <ToggleSwitch
          checked={viewMode === "diff"}
          onChange={(checked) => onViewModeChange(checked ? "diff" : "final")}
          label="변경사항 보기"
          size="md"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">내용 복사</span>
          <button
            className={`
              w-8 h-8 flex items-center justify-center text-xs rounded transition-all duration-200
              ${
                isCopied
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
              }
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
            `}
            onClick={handleCopyResult}
            title={isCopied ? "복사됨!" : "내용 복사"}
            aria-label={isCopied ? "복사됨!" : "내용 복사"}
          >
            {isCopied ? "✓" : "📋"}
          </button>
        </div>
      </div>
    </div>
  );
});

export default DiffViewerHeader;
