import { create } from "zustand";

interface LayoutState {
  isHeaderHidden: boolean;
  setHeaderHidden: (hidden: boolean) => void;
}

export const useLayoutStore = create<LayoutState>(set => ({
  isHeaderHidden: false,
  setHeaderHidden: hidden => set({ isHeaderHidden: hidden }),
}));
