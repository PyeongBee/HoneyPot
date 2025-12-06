"use client";

import { InputField, InputLabel } from "@/components/common/Input";
import { DEFAULT_CHAR_LIMIT } from "@/constants/editor";
import { ViewMode } from "@/types/editor";
import { TextStats } from "@/utils/textUtils";
import clsx from "clsx";
import CharacterCount from "./layout/CharacterCount";

interface QuestionEditorProps {
  viewMode: ViewMode;
  questionText: string;
  questionCharLimit: number;
  onQuestionChange: (text: string) => void;
  onQuestionLimitChange: (limit: number) => void;
  containerClassName?: string;
  originalStats: TextStats;
  editedStats: TextStats;
}

export default function QuestionEditor({
  viewMode,
  questionText,
  questionCharLimit,
  onQuestionChange,
  onQuestionLimitChange,
  containerClassName,
  originalStats,
  editedStats,
}: QuestionEditorProps) {
  const stats = viewMode === "original" ? originalStats : editedStats;

  return (
    <div className={clsx("dark:bg-gray-800", containerClassName ?? "mt-14")}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-2">
        {viewMode === "original" ? (
          <div className="lg:col-span-3">
            <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <textarea
                id="question-input"
                value={questionText}
                onChange={e => onQuestionChange(e.target.value)}
                placeholder="자소서 문항을 입력하세요. 예: '본인의 성장 과정에서 가장 중요한 경험은 무엇이며, 그것이 현재의 당신에게 어떤 영향을 미쳤나요?'"
                className="w-full h-24 p-4 border-0 resize-none focus:outline-none focus:ring-0 
                         bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                rows={4}
              />
            </div>
          </div>
        ) : (
          <div className="lg:col-span-3">
            <div className="space-y-2">
              <p className="text-gray-900 dark:text-white leading-relaxed">
                {questionText || "문항이 입력되지 않았습니다."}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-md">
                  제한: {questionCharLimit}자
                </span>
              </div>
            </div>
          </div>
        )}

        {viewMode === "original" && (
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 sticky top-24">
              <div className="flex items-center gap-3 mb-2">
                <InputLabel
                  htmlFor="char-limit-input"
                  className="text-sm font-medium text-gray-900 dark:text-white"
                >
                  글자수 제한
                </InputLabel>
                <InputField
                  id="char-limit-input"
                  type="text"
                  value={questionCharLimit}
                  onChange={value =>
                    onQuestionLimitChange(parseInt(value) || DEFAULT_CHAR_LIMIT)
                  }
                  className="w-24 text-center font-medium"
                />
              </div>
              <div className="flex flex-wrap justify-around gap-2">
                {[500, 1000, 2000].map(limit => (
                  <button
                    key={limit}
                    onClick={() => onQuestionLimitChange(limit)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      questionCharLimit === limit
                        ? "bg-amber-800 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {limit}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {viewMode !== "original" && (
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 sticky top-24">
              <CharacterCount
                characterCount={stats.characterCount}
                wordCount={stats.wordCount}
                lineCount={stats.lineCount}
                isOverLimit={stats.isOverLimit}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
