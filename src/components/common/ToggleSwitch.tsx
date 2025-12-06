import React from "react";

import { getToggleSwitchClasses, getToggleThumbClasses, type ToggleSize } from "@/styles/components";
import { cn } from "@/styles/components";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: ToggleSize;
  className?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  size = "md",
  className,
}) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {label && (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {label}
        </span>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={getToggleSwitchClasses(size, checked, disabled ? "opacity-50 cursor-not-allowed" : undefined)}
      >
        <span className={getToggleThumbClasses(size, checked)} />
      </button>
    </div>
  );
};

export default ToggleSwitch;
