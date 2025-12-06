"use client";

import { AlertCircle, X } from "lucide-react";
import React, { useEffect, useState } from "react";

import { useConfirmStore } from "../../stores/confirmStore";
import { cn } from "../../styles/components";

import { Button } from "./Button";

const ConfirmDialog: React.FC = () => {
  const { dialog, confirm, cancel, hideConfirm } = useConfirmStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (dialog.isOpen) {
      // 다이얼로그가 열릴 때 애니메이션
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
  }, [dialog.isOpen]);

  if (!dialog.isOpen) {
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      cancel();
    }
  };

  const handleCancel = () => {
    cancel();
  };

  const handleConfirm = () => {
    confirm();
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-[1300] flex items-center justify-center p-4",
        "transition-all duration-300 ease-in-out",
        isVisible ? "bg-black/50" : "bg-black/0"
      )}
      onClick={handleBackdropClick}
    >
      <div
        className={cn(
          "relative bg-white dark:bg-gray-800 rounded-lg shadow-xl",
          "w-full max-w-md overflow-hidden",
          "border border-gray-200 dark:border-gray-700",
          "transition-all duration-300 ease-in-out",
          isVisible
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4">
          <div className="flex items-start gap-3 flex-1">
            {dialog.variant === "destructive" && (
              <div className="flex-shrink-0 mt-0.5">
                <AlertCircle className="w-6 h-6 text-error-500" />
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                {dialog.message}
              </p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors ml-4"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 dark:bg-gray-900/50">
          <Button variant="outline" size="md" onClick={handleCancel}>
            {dialog.cancelText}
          </Button>
          <Button
            variant={
              dialog.variant === "destructive" ? "destructive" : "default"
            }
            size="md"
            onClick={handleConfirm}
          >
            {dialog.confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
