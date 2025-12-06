"use client";

import React from "react";

import { Memo, ViewMode } from "../../../../../types/editor";
import { TextStats } from "../../../../../utils/textUtils";

interface EditorSidebarProps {
  viewMode: ViewMode;
  memos: Memo[];
  originalStats: TextStats;
  editedStats: TextStats;
  onDeleteMemo: (memoId: string) => void;
  onMemoClick: (memo: Memo) => void;
  onMemoHover: (memoId: string | null) => void;
  renderCheckSidebar?: React.ReactNode;
}

const EditorSidebar: React.FC<EditorSidebarProps> = ({
  viewMode,
  memos,
  originalStats: _originalStats,
  editedStats: _editedStats,
  onDeleteMemo,
  onMemoClick,
  onMemoHover,
  renderCheckSidebar,
}) => {
  // 맞춤법/품질 검사 모드일 때는 해당 사이드바만 표시
  if (renderCheckSidebar) {
    return <div className="sticky top-24">{renderCheckSidebar}</div>;
  }

  // 결과 모드가 아니라면 별도 사이드바를 표시하지 않음
  if (viewMode !== "result") {
    return null;
  }

  return (
    <div className="sticky top-24">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            메모 목록 ({memos.length})
          </h3>
        </div>
        <div className="p-4 max-h-96 overflow-y-auto">
          {memos.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              아직 메모가 없습니다. 텍스트를 선택하고 메모를 추가해보세요.
            </p>
          ) : (
            <div className="space-y-3">
              {memos.map(memo => (
                <div
                  key={memo.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 hover:border-yellow-300 dark:hover:border-yellow-700 transition-all duration-200 cursor-pointer"
                  onClick={() => onMemoClick(memo)}
                  onMouseEnter={() => onMemoHover(memo.id)}
                  onMouseLeave={() => onMemoHover(null)}
                  title="클릭하여 해당 텍스트로 이동"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 dark:text-gray-300 break-words">
                        {memo.text}
                      </p>
                    </div>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onDeleteMemo(memo.id);
                      }}
                      className="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm flex-shrink-0"
                      title="메모 삭제"
                    >
                      🗑️
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(memo.timestamp).toLocaleString("ko-KR")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorSidebar;
