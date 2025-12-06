"use client";

import { CheckCircle, AlertCircle, X } from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";

import { MESSAGES } from "../../constants";
import { getToastClasses, cn, TOAST_DURATIONS } from "../../styles/components";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = "success", 
  duration = TOAST_DURATIONS.DEFAULT, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    // 애니메이션 완료 후 컴포넌트 제거
    setTimeout(() => {
      onClose();
    }, TOAST_DURATIONS.ANIMATION);
  }, [onClose]);

  useEffect(() => {
    // 컴포넌트 마운트 시 애니메이션 시작
    setIsVisible(true);

    // 지정된 시간 후 자동 닫기
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, handleClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-success-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-error-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-brand-500" />;
    }
  };

  const getToastVariant = () => {
    switch (type) {
      case "success":
        return "success" as const;
      case "error":
        return "destructive" as const;
      default:
        return "default" as const;
    }
  };

  return (
    <div
      className={cn(
        "fixed top-4 left-1/2 transform -translate-x-1/2 z-[1200]",
        "flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg",
        "transition-all duration-300 ease-in-out max-w-md min-w-80",
        getToastClasses(getToastVariant()),
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : '-translate-y-full opacity-0'
      )}
    >
      {getIcon()}
      <span className="flex-1 text-sm font-medium dark:text-black">
        {message}
      </span>
      <button
        onClick={handleClose}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        aria-label={MESSAGES.LABELS.CLOSE_TOAST}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
