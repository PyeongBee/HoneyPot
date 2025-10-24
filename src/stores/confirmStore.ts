import { create } from 'zustand';

export interface ConfirmDialogData {
  isOpen: boolean;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  onConfirm: () => void;
  onCancel?: () => void;
}

interface ConfirmState {
  dialog: ConfirmDialogData;
  
  // Actions
  showConfirm: (config: Omit<ConfirmDialogData, 'isOpen'>) => void;
  hideConfirm: () => void;
  confirm: () => void;
  cancel: () => void;
}

export const useConfirmStore = create<ConfirmState>((set, get) => ({
  dialog: {
    isOpen: false,
    message: '',
    confirmText: '확인',
    cancelText: '취소',
    variant: 'default',
    onConfirm: () => {},
  },

  showConfirm: (config) => {
    set({
      dialog: {
        isOpen: true,
        message: config.message,
        confirmText: config.confirmText || '확인',
        cancelText: config.cancelText || '취소',
        variant: config.variant || 'default',
        onConfirm: config.onConfirm,
        onCancel: config.onCancel,
      },
    });
  },

  hideConfirm: () => {
    set((state) => ({
      dialog: {
        ...state.dialog,
        isOpen: false,
      },
    }));
  },

  confirm: () => {
    const { dialog } = get();
    dialog.onConfirm();
    get().hideConfirm();
  },

  cancel: () => {
    const { dialog } = get();
    dialog.onCancel?.();
    get().hideConfirm();
  },
}));

