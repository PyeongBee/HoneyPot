/**
 * 맞춤법/품질 검사 항목을 표시하는 공통 컴포넌트
 */

"use client";

import { CheckCircle2, Circle } from "lucide-react";
import React, { ReactNode } from "react";

interface CheckItemProps {
  id: string;
  isChecked: boolean;
  isHovered?: boolean;
  onToggle: (id: string) => void;
  onHover?: (id: string | null) => void;
  children: ReactNode;
}

const CheckItem: React.FC<CheckItemProps> = ({
  id,
  isChecked,
  isHovered = false,
  onToggle,
  onHover,
  children,
}) => {
  return (
    <div
      className={`border rounded-lg p-3 transition-all duration-200 cursor-pointer ${
        isChecked
          ? "border-brand-400 bg-brand-50 dark:bg-brand-900/20"
          : isHovered
            ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20"
            : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
      }`}
      onClick={() => onToggle(id)}
      onMouseEnter={() => onHover?.(id)}
      onMouseLeave={() => onHover?.(null)}
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 flex-shrink-0 pointer-events-none">
          {isChecked ? (
            <CheckCircle2 className="w-5 h-5 text-brand-500" />
          ) : (
            <Circle className="w-5 h-5 text-gray-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
};

export default CheckItem;
