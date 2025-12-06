import React from "react";

import { CharacterCountProps } from "@/types/editor";
import { formatNumber } from "@/utils/textUtils";

const CharacterCount: React.FC<CharacterCountProps> = React.memo(
  ({ characterCount, wordCount, lineCount, isOverLimit }) => {
    const stats = [
      { label: "글자수", value: characterCount, isOverLimit },
      { label: "단어수", value: wordCount },
      { label: "줄수", value: lineCount },
    ];

    return (
      <div className="flex flex-col gap-2 text-sm">
        {stats.map(({ label, value, isOverLimit: overLimit = false }) => (
          <div key={label} className="flex items-center justify-between gap-2">
            <span className="text-gray-600 dark:text-gray-400">{label}:</span>
            <span
              className={`font-medium ${
                overLimit
                  ? "text-red-600 dark:text-red-400"
                  : "text-amber-800 dark:text-amber-300"
              }`}
            >
              {formatNumber(value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
);

export default CharacterCount;
