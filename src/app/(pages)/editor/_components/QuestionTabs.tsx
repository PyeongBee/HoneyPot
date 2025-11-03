"use client";

import { Button } from "@/components/common/Button";
import { EditorQuestionState } from "@/types/editor";
import { Plus, X } from "lucide-react";
import { useMemo } from "react";

interface QuestionTabsProps {
  questions: EditorQuestionState[];
  activeQuestionId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}

function getTabLabel(question: EditorQuestionState, index: number): string {
  const baseLabel = `문항 ${index + 1}`;
  const textCandidates = [
    question.questionText,
    question.originalText,
    question.editedText,
  ];

  for (const text of textCandidates) {
    if (text && text.trim()) {
      const trimmed = text.trim();
      if (trimmed.length <= 18) {
        return trimmed;
      }
      return `${trimmed.substring(0, 18)}...`;
    }
  }

  return baseLabel;
}

export default function QuestionTabs({
  questions,
  activeQuestionId,
  onSelect,
  onAdd,
  onRemove,
}: QuestionTabsProps) {
  const canRemove = useMemo(() => questions.length > 1, [questions.length]);

  return (
    <div className="dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 gap-4">
          <div className="flex-1 overflow-x-auto">
            <div className="flex items-center gap-2 min-w-max">
              {questions.map((question, index) => {
                const isActive = question.id === activeQuestionId;
                const label = getTabLabel(question, index);

                return (
                  <button
                    key={question.id}
                    type="button"
                    onClick={() => onSelect(question.id)}
                    className={`group relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap border ${
                      isActive
                        ? "border-transparent bg-brand-500 text-white shadow"
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <span className="max-w-[10rem] truncate">{label}</span>
                    {canRemove && (
                      <span
                        onClick={event => {
                          event.stopPropagation();
                          onRemove(question.id);
                        }}
                        role="button"
                        aria-label="문항 삭제"
                        className={`rounded-full p-1 transition-colors ${
                          isActive
                            ? "text-white/80 hover:text-white hover:bg-white/20"
                            : "text-gray-400 hover:text-gray-600 hover:bg-gray-200/60 dark:hover:bg-gray-600/60"
                        }`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            onClick={onAdd}
            className="shrink-0 border border-dashed border-gray-300 dark:border-gray-600 hover:border-brand-500/70"
          >
            <Plus className="h-4 w-4 mr-1" />새 문항
          </Button>
        </div>
      </div>
    </div>
  );
}
