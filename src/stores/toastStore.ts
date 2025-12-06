import { create } from 'zustand';

import { TOAST_DURATIONS } from '../styles/components';

export interface ToastData {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  duration: number;
}

interface ToastState {
  toasts: ToastData[];
  
  // Actions
  addToast: (message: string, type?: "success" | "error" | "info", duration?: number) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
  
  // Convenience methods
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  addToast: (message, type = "success", duration) => {
    const defaultDuration = type === "error" ? TOAST_DURATIONS.ERROR 
                           : type === "info" ? TOAST_DURATIONS.INFO 
                           : TOAST_DURATIONS.SUCCESS;
    const finalDuration = duration ?? defaultDuration;
    const id = Date.now().toString();
    
    const newToast: ToastData = {
      id,
      message,
      type,
      duration: finalDuration,
    };
    
    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  clearAllToasts: () => {
    set({ toasts: [] });
  },

  showSuccess: (message, duration) => {
    get().addToast(message, "success", duration);
  },

  showError: (message, duration) => {
    get().addToast(message, "error", duration);
  },

  showInfo: (message, duration) => {
    get().addToast(message, "info", duration);
  },
}));
