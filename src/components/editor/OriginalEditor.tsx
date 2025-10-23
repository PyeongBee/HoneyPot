import { MESSAGES } from "@/constants/messages";
import React from "react";

interface OriginalEditorProps {
  originalText: string;
  onOriginalChange: (text: string) => void;
}

const OriginalEditor: React.FC<OriginalEditorProps> = React.memo(
  function OriginalEditor({ originalText, onOriginalChange }) {

    return (
      <div className="w-full h-full">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <label className="text-lg font-semibold text-gray-900 dark:text-white">
              {MESSAGES.LABELS.ORIGINAL_TITLE}
            </label>
          </div>
          <textarea
            className="w-full h-128 p-4 border-0 resize-none focus:outline-none focus:ring-0 
                   bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            value={originalText}
            onChange={(e) => onOriginalChange(e.target.value)}
            placeholder={MESSAGES.LABELS.ORIGINAL_PLACEHOLDER}
            aria-label={MESSAGES.LABELS.ORIGINAL_ARIA}
          />
        </div>
      </div>
    );
  }
);

export default OriginalEditor;
