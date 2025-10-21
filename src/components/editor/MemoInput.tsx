import React, { useState } from "react";
import { SelectionInfo } from "../../types/editor";
import { Button } from "../common/Button";
import { InputField } from "../common/Input";

interface MemoInputProps {
  selectedText: SelectionInfo;
  onSave: (memoText: string) => void;
  onCancel: () => void;
}

const MemoInput: React.FC<MemoInputProps> = ({ selectedText, onSave, onCancel }) => {
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
    <div className="memo-input-container absolute top-4 right-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-4 z-10 max-w-sm">
      <div className="mb-3">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">선택된 텍스트:</p>
        <p className="text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded border">
          &ldquo;{selectedText.text}&rdquo;
        </p>
      </div>
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          메모 입력
        </label>
        <InputField
          value={memoText}
          onChange={setMemoText}
          placeholder="메모를 입력하세요..."
          className="w-full"
        />
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSave} disabled={!memoText.trim()} className="flex-1">
          저장
        </Button>
        <Button variant="secondary" onClick={handleCancel} className="flex-1">
          취소
        </Button>
      </div>
    </div>
  );
};

export default MemoInput;
