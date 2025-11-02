"use client";

import Toast from "@/components/common/Toast";
import { ToastData, useToastStore } from "@/stores/toastStore";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { toasts, removeToast } = useToastStore();

  return (
    <>
      {children}

      {/* 토스트 메시지 */}
      {toasts.map((toast: ToastData) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );
}
