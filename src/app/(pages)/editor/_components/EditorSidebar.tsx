/**
 * 에디터 사이드바 섹션 컴포넌트
 */

"use client";

import { Share2 } from "lucide-react";
import React from "react";
import { Button } from "../../../../components/common/Button";
import { InputField, InputLabel } from "../../../../components/common/Input";
import { Section } from "../../../../components/common/Section";
import {
  CHAR_LIMIT_STEP,
  MAX_CHAR_LIMIT,
  MIN_CHAR_LIMIT,
} from "../../../../constants/editor";
import { Memo, ViewMode } from "../../../../types/editor";
import { TextStats } from "../../../../utils/textUtils";
import CharacterCount from "./CharacterCount";

interface EditorSidebarProps {
  viewMode: ViewMode;
  isSpellCheckMode: boolean;
  isQualityCheckActive: boolean;
  originalText: string;
  editedText: string;
  questionText: string;
  questionCharLimit: number;
  memos: Memo[];
  isCopied: boolean;
  shareUrl: string;
  originalStats: TextStats;
  editedStats: TextStats;
  onQuestionTextChange: (text: string) => void;
  onQuestionCharLimitChange: (limit: number) => void;
  onAddMemo: (memo: Memo) => void;
  onDeleteMemo: (memoId: string) => void;
  onMemoClick: (memo: Memo) => void;
  onMemoHover: (memoId: string | null) => void;
  onShare: () => void;
  onCopyUrl: () => void;
  renderCheckSidebar?: React.ReactNode;
}

const EditorSidebar: React.FC<EditorSidebarProps> = ({
  viewMode,
  isSpellCheckMode,
  isQualityCheckActive,
  originalText,
  editedText,
  questionText,
  questionCharLimit,
  memos,
  isCopied,
  shareUrl,
  originalStats,
  editedStats,
  onQuestionTextChange,
  onQuestionCharLimitChange,
  onAddMemo,
  onDeleteMemo,
  onMemoClick,
  onMemoHover,
  onShare,
  onCopyUrl,
  renderCheckSidebar,
}) => {
  // 맞춤법/품질 검사 모드일 때는 해당 사이드바만 표시
  if (renderCheckSidebar) {
    return <div className="sticky top-24">{renderCheckSidebar}</div>;
  }

  // 일반 사이드바 표시
  return (
    <div className="space-y-4 sticky top-24">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4">
        <CharacterCount
          characterCount={
            viewMode === "original"
              ? originalStats.characterCount
              : editedStats.characterCount
          }
          wordCount={
            viewMode === "original"
              ? originalStats.wordCount
              : editedStats.wordCount
          }
          lineCount={
            viewMode === "original"
              ? originalStats.lineCount
              : editedStats.lineCount
          }
          charLimit={questionCharLimit}
          isOverLimit={
            viewMode === "original"
              ? originalStats.isOverLimit
              : editedStats.isOverLimit
          }
        />
      </div>

      {viewMode === "result" && (
        <>
          <Section>
            <InputLabel htmlFor="questionInput">질문</InputLabel>
            <InputField
              id="questionInput"
              value={questionText}
              onChange={onQuestionTextChange}
              placeholder="질문을 입력하세요"
            />
            <div className="mt-2 flex items-center justify-between">
              <label className="text-sm text-gray-600 dark:text-gray-400">
                글자 수 제한
              </label>
              <input
                type="number"
                value={questionCharLimit}
                onChange={e =>
                  onQuestionCharLimitChange(Number(e.target.value))
                }
                min={MIN_CHAR_LIMIT}
                max={MAX_CHAR_LIMIT}
                step={CHAR_LIMIT_STEP}
                className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </Section>

          <Section>
            <Button
              onClick={onShare}
              variant="default"
              className="w-full flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              공유하기
            </Button>
            {shareUrl && (
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  공유 링크:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 px-2 py-1 text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded"
                  />
                  <Button onClick={onCopyUrl} variant="secondary" size="sm">
                    {isCopied ? "복사됨!" : "복사"}
                  </Button>
                </div>
              </div>
            )}
          </Section>
        </>
      )}
    </div>
  );
};

export default EditorSidebar;
