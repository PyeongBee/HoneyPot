"use client";

import { Plus } from "lucide-react";
import { useCallback, useMemo } from "react";

import { useEditorStore } from "@/stores/editorStore";

export default function QuestionTabs() {
  const {
    questions,
    activeQuestionId,
    setActiveQuestionId,
    addQuestion,
    setViewMode,
  } = useEditorStore();

  const canAdd = useMemo(() => questions.length < 10, [questions.length]);

  const handleAddQuestion = useCallback(() => {
    addQuestion();
    setViewMode("original");
  }, [addQuestion, setViewMode]);

  return (
    <div className="dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {questions.map((question, index) => {
              const isActive = question.id === activeQuestionId;

              return (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => setActiveQuestionId(question.id)}
                  className={`group relative flex items-center rounded-full px-6 py-2 text-sm font-medium transition-colors whitespace-nowrap border ${
                    isActive
                      ? "border-transparent bg-brand-500 text-white shadow"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <span className="hidden md:inline">문항 </span>
                  {index + 1}
                </button>
              );
            })}

            <button
              type="button"
              onClick={handleAddQuestion}
              disabled={!canAdd}
              className={`flex items-center gap-2 rounded-full px-6 py-2 text-sm font-medium transition-colors whitespace-nowrap border border-dashed ${
                canAdd
                  ? "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-brand-500/70 hover:text-brand-500"
                  : "border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50"
              }`}
            >
              <Plus className="h-4 w-4" />새 문항
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
