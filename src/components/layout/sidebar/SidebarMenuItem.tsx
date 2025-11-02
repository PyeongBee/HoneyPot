import { usePathname, useRouter } from "next/navigation";
import React from "react";
import {
  getSidebarMenuItemClasses,
  sidebarMenuItemStyles,
} from "../../../styles/components";
import { MenuItem } from "../../../types/components";

interface SidebarMenuItemProps {
  item: MenuItem;
  isCollapsed: boolean;
  onNavigate?: (href: string) => void;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  item,
  isCollapsed,
  onNavigate,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const IconComponent = item.icon;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();

    // 현재 페이지와 같은 경로면 이동하지 않음
    if (pathname === item.href) {
      return;
    }

    if (onNavigate) {
      onNavigate(item.href);
    } else {
      router.push(item.href);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={getSidebarMenuItemClasses(isCollapsed, "sidebar-menu-item")}
      title={isCollapsed ? item.label : undefined}
    >
      <div className={sidebarMenuItemStyles.icon.container}>
        <IconComponent className={sidebarMenuItemStyles.icon.size} />
      </div>
      {!isCollapsed && (
        <span className={sidebarMenuItemStyles.label}>{item.label}</span>
      )}
    </button>
  );
};

export default SidebarMenuItem;
