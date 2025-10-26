import React, { useState } from "react";
import { Button } from "../../../../components/common/Button";
import { InputField } from "../../../../components/common/Input";
import { SelectionInfo } from "../../../../types/editor";

interface MemoInputProps {
  selectedText: SelectionInfo;
  onSave: (memoText: string) => void;
  onCancel: () => void;
}

const MemoInput: React.FC<MemoInputProps> = ({
  selectedText,
  onSave,
  onCancel,
}) => {
  const [memoText, setMemoText] = useState<string>("");

  const handleSave = () => {
    if (memoText.trim()) {
      onSave(memoText.trim());
      setMemoText("");
    }
  };

  const handleCancel = () => {
    setMemoText("");
    onCancel();
  };

  return (
    <>
      {/* 배경 오버레이 */}
      <div
        className="fixed inset-0 bg-black/30 z-[1000]"
        onClick={handleCancel}
      />

      {/* 메모 입력 모달 */}
      <div className="memo-input-container fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-2xl p-6 z-[1001] w-full max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          메모 추가
        </h3>

        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            선택된 텍스트:
          </p>
          <p className="text-sm bg-gray-100 dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600 max-h-24 overflow-y-auto">
            &ldquo;{selectedText.text}&rdquo;
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            메모 내용
          </label>
          <InputField
            value={memoText}
            onChange={setMemoText}
            placeholder="메모를 입력하세요..."
            className="w-full"
            autoFocus
          />
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleSave}
            disabled={!memoText.trim()}
            className="flex-1"
          >
            저장
          </Button>
          <Button variant="secondary" onClick={handleCancel} className="flex-1">
            취소
          </Button>
        </div>
      </div>
    </>
  );
};

export default MemoInput;
