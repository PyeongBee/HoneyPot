import { create } from "zustand";
import { SpellCheckSuggestion } from "../types/components";

interface SpellCheckState {
  isSpellCheckMode: boolean;
  isLoading: boolean;
  suggestions: SpellCheckSuggestion[];
  hoveredSuggestionId: string | null;

  // Actions
  setSpellCheckMode: (mode: boolean) => void;
  setLoading: (loading: boolean) => void;
  setSuggestions: (suggestions: SpellCheckSuggestion[]) => void;
  toggleSuggestionCheck: (id: string) => void;
  setSelectedSuggestion: (id: string, suggestion: string) => void;
  setHoveredSuggestion: (id: string | null) => void;
  clearSuggestions: () => void;
  getCheckedSuggestions: () => SpellCheckSuggestion[];
}

export const useSpellCheckStore = create<SpellCheckState>((set, get) => ({
  isSpellCheckMode: false,
  isLoading: false,
  suggestions: [],
  hoveredSuggestionId: null,

  setSpellCheckMode: mode => set({ isSpellCheckMode: mode }),
  setLoading: loading => set({ isLoading: loading }),
  setSuggestions: suggestions => set({ suggestions }),

  toggleSuggestionCheck: id =>
    set(state => ({
      suggestions: state.suggestions.map(suggestion =>
        suggestion.id === id
          ? { ...suggestion, isChecked: !suggestion.isChecked }
          : suggestion
      ),
    })),

  setSelectedSuggestion: (id, suggestion) =>
    set(state => ({
      suggestions: state.suggestions.map(s =>
        s.id === id ? { ...s, selectedSuggestion: suggestion } : s
      ),
    })),

  setHoveredSuggestion: id => set({ hoveredSuggestionId: id }),

  clearSuggestions: () => set({ suggestions: [], hoveredSuggestionId: null }),

  getCheckedSuggestions: () => {
    const state = get();
    return state.suggestions.filter(s => s.isChecked);
  },
}));
