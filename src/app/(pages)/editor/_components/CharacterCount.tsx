import React from "react";
import { CharacterCountProps } from "../../../../types/editor";
import { formatNumber } from "../../../../utils/textUtils";
// 통계 관련 작은 컴포넌트들
interface LabelProps {
  children: React.ReactNode;
  className?: string;
}

const Label: React.FC<LabelProps> = ({ children, className = "" }) => (
  <span className={`text-gray-600 dark:text-gray-400 ${className}`}>
    {children}
  </span>
);

interface ValueProps {
  children: React.ReactNode;
  className?: string;
  isOverLimit?: boolean;
}

const Value: React.FC<ValueProps> = ({
  children,
  className = "",
  isOverLimit = false,
}) => (
  <span
    className={`
      font-medium text-amber-800 dark:text-amber-300
      ${isOverLimit ? "text-red-600 dark:text-red-400" : ""}
      ${className}
    `}
  >
    {children}
  </span>
);

interface StatItemProps {
  label: string;
  value: string | number;
  isOverLimit?: boolean;
  className?: string;
}

const StatItem: React.FC<StatItemProps> = ({
  label,
  value,
  isOverLimit = false,
  className = "",
}) => (
  <div className={`flex items-center justify-between gap-2 ${className}`}>
    <Label>{label}:</Label>
    <Value isOverLimit={isOverLimit}>{value}</Value>
  </div>
);

interface StatGroupProps {
  children: React.ReactNode;
  className?: string;
}

const StatGroup: React.FC<StatGroupProps> = ({ children, className = "" }) => (
  <div className={`flex flex-col gap-2 text-sm ${className}`}>{children}</div>
);

interface CharacterCountComponentProps extends CharacterCountProps {
  showCopyButton?: boolean;
  onCopy?: () => void;
  copyButtonText?: string;
  copySuccessText?: string;
  isCopied?: boolean;
}

const CharacterCount: React.FC<CharacterCountComponentProps> = React.memo(
  ({
    characterCount,
    wordCount,
    lineCount,
    isOverLimit,
    showCopyButton = false,
    onCopy,
    copyButtonText = "📋",
    copySuccessText = "✓",
    isCopied = false,
  }) => {
    return (
      <StatGroup>
        <StatItem
          label="글자수"
          value={formatNumber(characterCount)}
          isOverLimit={isOverLimit}
        />
        <StatItem label="단어수" value={formatNumber(wordCount)} />
        <StatItem label="줄수" value={formatNumber(lineCount)} />
        {showCopyButton && onCopy && (
          <button
            className={`
            w-full mt-2 py-2 px-3 flex items-center justify-center text-xs rounded transition-all duration-200
            ${
              isCopied
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
            }
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
          `}
            onClick={onCopy}
            title={isCopied ? "복사됨!" : "결과 복사"}
            aria-label={isCopied ? "복사됨!" : "결과 복사"}
          >
            {isCopied ? copySuccessText : copyButtonText}
          </button>
        )}
      </StatGroup>
    );
  }
);

export default CharacterCount;
