"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import React, { ReactNode } from "react";

interface CheckSidebarLayoutProps {
  title: string;
  isLoading: boolean;
  loadingMessage: string;
  itemCount?: number;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  children: ReactNode;
  onClose?: () => void;
}

const CheckSidebarLayout: React.FC<CheckSidebarLayoutProps> = ({
  title,
  isLoading,
  loadingMessage,
  itemCount,
  emptyMessage,
  emptyIcon,
  children,
  onClose,
}) => {
  // 로딩 상태
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center px-4 py-3.5 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-10">
            {title}
          </h3>
        </div>
        <div className="h-128 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">
            {loadingMessage}
          </span>
        </div>
      </div>
    );
  }

  // 일반 상태
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center px-4 py-3.5 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-10">
          {title}
        </h3>
        <div className="flex items-center gap-2">
          {itemCount !== undefined && (
            <span className="text-sm text-gray-500 dark:text-gray-400 leading-10">
              {itemCount}개 발견
            </span>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl leading-none"
              aria-label={`${title} 닫기`}
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="h-128 p-4 overflow-y-auto">
        {itemCount === 0 && emptyMessage ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {emptyIcon || (
              <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-success-500" />
            )}
            <p>{emptyMessage}</p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default CheckSidebarLayout;
