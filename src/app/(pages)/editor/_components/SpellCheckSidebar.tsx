"use client";

import React, { useCallback } from "react";
import { Button } from "../../../../components/common/Button";
import { MESSAGES } from "../../../../constants";
import { useSpellCheckStore } from "../../../../stores/spellCheckStore";
import CheckItem from "./CheckItem";
import CheckSidebarLayout from "./layout/CheckSidebarLayout";

interface SpellCheckSidebarProps {
  onApplyCorrections: () => void;
}

const SpellCheckSidebar: React.FC<SpellCheckSidebarProps> = ({
  onApplyCorrections,
}) => {
  const {
    suggestions,
    isLoading,
    hoveredSuggestionId,
    toggleSuggestionCheck,
    setSelectedSuggestion,
    setHoveredSuggestion,
    getCheckedSuggestions,
  } = useSpellCheckStore();

  const checkedCount = getCheckedSuggestions().length;

  const handleSuggestionClick = useCallback(
    (suggestionId: string, suggestion: string) => {
      setSelectedSuggestion(suggestionId, suggestion);
    },
    [setSelectedSuggestion]
  );

  return (
    <CheckSidebarLayout
      title={MESSAGES.LABELS.SPELL_CHECK_TITLE}
      isLoading={isLoading}
      loadingMessage={MESSAGES.SPELL_CHECK.LOADING}
      itemCount={suggestions.length}
      emptyMessage={MESSAGES.SPELL_CHECK.NO_ERRORS_FOUND}
    >
      {suggestions.length > 0 && (
        <div className="mb-4">
          <Button
            onClick={onApplyCorrections}
            disabled={checkedCount === 0}
            className="w-full"
            variant="default"
          >
            {MESSAGES.BUTTONS.APPLY_CORRECTIONS} ({checkedCount}개 적용)
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {suggestions.map(suggestion => (
          <CheckItem
            key={suggestion.id}
            id={suggestion.id}
            isChecked={suggestion.isChecked}
            isHovered={hoveredSuggestionId === suggestion.id}
            onToggle={toggleSuggestionCheck}
            onHover={setHoveredSuggestion}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-sm rounded font-medium">
                {suggestion.token}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                →
              </span>
            </div>

            <div className="space-y-1">
              {suggestion.suggestions.map((sug, index) => (
                <button
                  key={index}
                  onClick={e => {
                    e.stopPropagation();
                    handleSuggestionClick(suggestion.id, sug);
                  }}
                  className={`block text-left px-2 py-1 text-sm rounded transition-colors ${
                    suggestion.selectedSuggestion === sug
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                      : "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50"
                  }`}
                >
                  {sug}
                </button>
              ))}
            </div>

            {suggestion.info && (
              <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                {suggestion.info}
              </p>
            )}
          </CheckItem>
        ))}
      </div>
    </CheckSidebarLayout>
  );
};

export default SpellCheckSidebar;
