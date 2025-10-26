import React from "react";
import { cn } from "../../styles/components";

interface ModeButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  role?: string;
  "aria-selected"?: boolean;
  "aria-controls"?: string;
  tabIndex?: number;
}

export const ModeButton: React.FC<ModeButtonProps> = React.memo(
  function ModeButton({ active, onClick, children, className, ...props }) {
    return (
      <button
        className={cn(
          "px-4 py-1 border-2 text-white rounded-full",
          "font-medium transition-all duration-300 ease-out",
          "transform hover:scale-105 active:scale-95",
          "hover:shadow-lg hover:shadow-white/20",
          "focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent",
          active
            ? "bg-white/20 border-white backdrop-blur-sm shadow-md hover:bg-white/30 hover:border-white"
            : "bg-transparent border-white/40 hover:bg-white/10 hover:border-white/70",
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
