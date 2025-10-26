import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { MENU_LABELS } from "../../../constants/navigation";
import {
  getSidebarMenuItemClasses,
  sidebarMenuItemStyles,
} from "../../../styles/components";
import { MenuItem } from "../../../types/components";
import MoreDropdown from "./MoreDropdown";

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

  // 더보기 메뉴인 경우 드롭다운 컴포넌트 렌더링
  if (item.label === MENU_LABELS.MORE_MENU) {
    return <MoreDropdown isCollapsed={isCollapsed} onNavigate={onNavigate} />;
  }

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
