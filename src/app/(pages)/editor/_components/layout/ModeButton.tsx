import React from "react";

import { cn } from "../../../../../styles/components";

type ModeButtonVariant = "text" | "pill";

interface ModeButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  variant?: ModeButtonVariant;
  role?: string;
  "aria-selected"?: boolean;
  "aria-controls"?: string;
  tabIndex?: number;
}

export const ModeButton: React.FC<ModeButtonProps> = React.memo(
  function ModeButton({
    active,
    onClick,
    children,
    className,
    variant = "text",
    ...props
  }) {
    const textVariant = cn(
      "px-1 md:px-2 py-0.5 text-sm md:text-base",
      "transition-colors duration-200",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
      active
        ? "font-bold text-amber-500 dark:text-gray-100"
        : "font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
    );

    const pillVariant = cn(
      "px-4 py-1 rounded-full border",
      "transition-colors duration-200",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
      active
        ? "bg-brand-50 text-brand-700 border-brand-200"
        : "bg-transparent text-gray-700 border-gray-300 hover:text-gray-900 hover:border-gray-400"
    );

    return (
      <button
        className={cn(
          variant === "pill" ? pillVariant : textVariant,
          className
        )}
        onClick={onClick}
        {...props}
      >
        {children}
      </button>
    );
  }
);

export default ModeButton;
