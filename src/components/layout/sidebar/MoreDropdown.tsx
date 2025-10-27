"use client";

import React from "react";
import MoreMenuDropdown from "../../common/MoreMenuDropdown";

interface MoreDropdownProps {
  isCollapsed: boolean;
  onNavigate?: (href: string) => void;
}

const MoreDropdown: React.FC<MoreDropdownProps> = ({
  isCollapsed,
  onNavigate,
}) => {
  return (
    <MoreMenuDropdown
      position="top"
      align="left"
      isCollapsed={isCollapsed}
      showButton={true}
      onNavigate={onNavigate}
    />
  );
};

export default MoreDropdown;
