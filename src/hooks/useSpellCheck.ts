import { useCallback } from "react";

import { MESSAGES } from "../constants";
import { useSpellCheckStore } from "../stores/spellCheckStore";
import { SpellCheckResult } from "../types";

interface UseSpellCheckProps {
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

export const useSpellCheck = ({ showError, showSuccess }: UseSpellCheckProps) => {
  const {
    isSpellCheckMode,
    isLoading,
    setSpellCheckMode,
    setLoading,
    setSuggestions,
    clearSuggestions,
  } = useSpellCheckStore();

  const performSpellCheck = useCallback(async (text: string) => {
    if (!text.trim()) {
      showError(MESSAGES.SPELL_CHECK.NO_TEXT);
      return;
    }

    setLoading(true);
    setSpellCheckMode(true);

    try {
      const response = await fetch("/api/spell-check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          error: MESSAGES.SPELL_CHECK.UNKNOWN_ERROR 
        }));
        throw new Error(`${MESSAGES.SPELL_CHECK.REQUEST_FAILED}: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();

      if (!data.results || !Array.isArray(data.results)) {
        throw new Error(MESSAGES.SPELL_CHECK.INVALID_RESPONSE);
      }

      const suggestions = data.results.map((result: SpellCheckResult, index: number) => ({
        id: `suggestion-${index}`,
        token: result.token,
        suggestions: result.suggestions,
        info: result.info,
        start: result.start,
        end: result.end,
        isChecked: false,
        selectedSuggestion: result.suggestions[0],
      }));

      setSuggestions(suggestions);
      
      if (suggestions.length === 0) {
        showSuccess(MESSAGES.SPELL_CHECK.NO_ERRORS);
      }
    } catch (error) {
      showError(`${MESSAGES.SPELL_CHECK.ERROR_OCCURRED}: ${error instanceof Error ? error.message : MESSAGES.SPELL_CHECK.UNKNOWN_ERROR}`);
      setSpellCheckMode(false);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setSpellCheckMode, setSuggestions, showError, showSuccess]);

  const cancelSpellCheck = useCallback(() => {
    setSpellCheckMode(false);
    clearSuggestions();
  }, [setSpellCheckMode, clearSuggestions]);

  return {
    isSpellCheckMode,
    isLoading,
    performSpellCheck,
    cancelSpellCheck,
  };
};
