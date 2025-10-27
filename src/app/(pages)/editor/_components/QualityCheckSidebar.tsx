"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";
import React from "react";
import { Button } from "../../../../components/common/Button";
import { useQualityCheckStore } from "../../../../stores/qualityCheckStore";
import { QualityIssueType } from "../../../../types/qualityCheck";
import { filterRemovableIssues } from "../../../../utils/correctionUtils";
import CheckItem from "./CheckItem";
import CheckSidebarLayout from "./layout/CheckSidebarLayout";

const ISSUE_TYPE_LABELS: Record<QualityIssueType, string> = {
  sentence_length: "문장 길이",
  comma_overuse: "쉼표 남용",
  modifier_overuse: "수식어 남발",
  repeat: "반복",
  colloquial: "구어체",
};

const ISSUE_TYPE_COLORS: Record<QualityIssueType, string> = {
  sentence_length:
    "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300",
  comma_overuse:
    "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300",
  modifier_overuse:
    "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300",
  repeat: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300",
  colloquial: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300",
};

interface QualityCheckSidebarProps {
  onClose: () => void;
  onApplyCorrections?: () => void;
}

const QualityCheckSidebar: React.FC<QualityCheckSidebarProps> = ({
  onClose,
  onApplyCorrections,
}) => {
  const {
    result,
    isChecking,
    toggleIssueCheck,
    getCheckedIssues,
    setHoveredIssue,
    hoveredIssueId,
  } = useQualityCheckStore();

  const checkedIssues = getCheckedIssues();
  const removableCheckedIssues = filterRemovableIssues(checkedIssues);

  return (
    <CheckSidebarLayout
      title="품질 검사"
      isLoading={isChecking}
      loadingMessage="텍스트 분석 중..."
      itemCount={result?.totalIssues}
      emptyMessage="품질 문제가 발견되지 않았습니다!"
      emptyIcon={
        <>
          <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-success-500" />
          <p className="text-sm mt-2">잘 작성된 글입니다.</p>
        </>
      }
      onClose={onClose}
    >
      {result && result.totalIssues > 0 && (
        <>
          {removableCheckedIssues.length > 0 && onApplyCorrections && (
            <div className="mb-4">
              <Button
                onClick={onApplyCorrections}
                className="w-full"
                variant="default"
              >
                제거하기 ({removableCheckedIssues.length}개)
              </Button>
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800 dark:text-blue-300">
                <p className="font-medium mb-1">품질 검사 결과</p>
                <ul className="space-y-1 text-xs">
                  {result.issueCounts.sentence_length > 0 && (
                    <li>• 문장 길이: {result.issueCounts.sentence_length}건</li>
                  )}
                  {result.issueCounts.comma_overuse > 0 && (
                    <li>• 쉼표 남용: {result.issueCounts.comma_overuse}건</li>
                  )}
                  {result.issueCounts.modifier_overuse > 0 && (
                    <li>
                      • 수식어 남발: {result.issueCounts.modifier_overuse}건
                    </li>
                  )}
                  {result.issueCounts.repeat > 0 && (
                    <li>• 반복: {result.issueCounts.repeat}건</li>
                  )}
                  {result.issueCounts.colloquial > 0 && (
                    <li>• 구어체: {result.issueCounts.colloquial}건</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {result.issues.map(issue => (
              <CheckItem
                key={issue.id}
                id={issue.id}
                isChecked={issue.checked || false}
                isHovered={hoveredIssueId === issue.id}
                onToggle={toggleIssueCheck}
                onHover={setHoveredIssue}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-2 py-1 text-xs rounded font-medium ${
                      ISSUE_TYPE_COLORS[issue.type]
                    }`}
                  >
                    {ISSUE_TYPE_LABELS[issue.type]}
                  </span>
                </div>

                {issue.token &&
                  issue.type !== "sentence_length" &&
                  issue.type !== "comma_overuse" && (
                    <div className="mb-2">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-sm rounded font-mono">
                        {issue.token}
                      </span>
                    </div>
                  )}

                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                  {issue.message}
                </p>

                {issue.suggestion !== undefined && (
                  <div className="mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      제안:{" "}
                    </span>
                    <span className="text-sm text-green-600 dark:text-green-400">
                      {issue.suggestion || "(삭제 권장)"}
                    </span>
                  </div>
                )}
              </CheckItem>
            ))}
          </div>
        </>
      )}
    </CheckSidebarLayout>
  );
};

export default QualityCheckSidebar;
