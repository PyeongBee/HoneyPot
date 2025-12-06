import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

import { cn } from "../../../styles/components";

interface SidebarToggleProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const SidebarToggle: React.FC<SidebarToggleProps> = ({
  isCollapsed,
  onToggle,
}) => {
  return (
    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 z-10">
      <button
        onClick={onToggle}
        className={cn(
          "w-8 h-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
          "rounded-full flex items-center justify-center shadow-lg",
          "hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-110",
          "transition-all duration-200"
        )}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        )}
      </button>
    </div>
  );
};

export default SidebarToggle;
