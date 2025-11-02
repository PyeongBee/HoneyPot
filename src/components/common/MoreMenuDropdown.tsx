"use client";

import { MoreHorizontal } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import {
  AUTH_MENU_ITEMS,
  MENU_LABELS,
  MORE_MENU_ITEMS,
} from "../../constants/navigation";
import { useAuthStore } from "../../stores/authStore";
import {
  cn,
  dropdownStyles,
  getDropdownArrowClasses,
  getDropdownClasses,
  getSidebarMenuItemClasses,
  sidebarMenuItemStyles,
} from "../../styles/components";

interface MoreMenuDropdownProps {
  // 드롭다운 위치 및 스타일 설정
  position?: "top" | "bottom";
  align?: "left" | "center" | "right";
  className?: string;

  // 버튼 스타일 설정 (사이드바용)
  isCollapsed?: boolean;
  showButton?: boolean;

  // 이벤트 핸들러
  onNavigate?: (href: string) => void;
  onItemClick?: (href: string) => void;

  // 외부에서 드롭다운 상태 제어
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

const MoreMenuDropdown: React.FC<MoreMenuDropdownProps> = ({
  position = "top",
  align = "left",
  className = "",
  isCollapsed = false,
  showButton = true,
  onNavigate,
  onItemClick,
  isOpen: externalIsOpen,
  onToggle,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 실제 인증 상태 사용
  const { isAuthenticated } = useAuthStore();

  // 외부에서 제어하는 경우 외부 상태 사용, 아니면 내부 상태 사용
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = onToggle || setInternalIsOpen;

  // 통합된 메뉴 소스 사용
  const menuItems = MORE_MENU_ITEMS;
  const authItem = isAuthenticated
    ? AUTH_MENU_ITEMS.LOGOUT
    : AUTH_MENU_ITEMS.LOGIN;

  // 인증 상태 변경 시 드롭다운 닫기 (로그인/로그아웃 시 메뉴 상태 초기화)
  useEffect(() => {
    setIsOpen(false);
  }, [isAuthenticated, setIsOpen]);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsOpen]);

  const handleItemClick = (href: string) => {
    setIsOpen(false);

    if (onItemClick) {
      onItemClick(href);
    } else if (onNavigate) {
      onNavigate(href);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  // 드롭다운과 화살표 클래스 계산 (최적화된 헬퍼 함수 사용)
  const dropdownClasses = getDropdownClasses(position, align, isCollapsed);
  const arrowClasses = getDropdownArrowClasses(position, align);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div className={dropdownClasses}>
          {/* 일반 메뉴 아이템들 */}
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleItemClick(item.href)}
              className={cn(dropdownStyles.menuItem)}
            >
              <item.icon className="w-4 h-4 mr-3" />
              {item.label}
            </button>
          ))}

          {/* 구분선 */}
          <div className={dropdownStyles.divider} />

          {/* 로그인/로그아웃 메뉴 */}
          <button
            onClick={() => handleItemClick(authItem.href)}
            className={cn(dropdownStyles.menuItem)}
          >
            <authItem.icon className="w-4 h-4 mr-3" />
            {authItem.label}
          </button>

          {/* 화살표 */}
          <div className={arrowClasses}></div>
        </div>
      )}

      {/* 더보기 버튼 (showButton이 true일 때만 표시) */}
      {showButton && (
        <button
          onClick={handleToggle}
          className={getSidebarMenuItemClasses(
            isCollapsed,
            `sidebar-menu-item ${isOpen ? "bg-gray-100 dark:bg-gray-800" : ""}`
          )}
          title={isCollapsed ? MENU_LABELS.MORE_MENU : undefined}
        >
          <div className={sidebarMenuItemStyles.icon.container}>
            <MoreHorizontal className={sidebarMenuItemStyles.icon.size} />
          </div>
          {!isCollapsed && (
            <span className={sidebarMenuItemStyles.label}>
              {MENU_LABELS.MORE_MENU}
            </span>
          )}
        </button>
      )}
    </div>
  );
};

export default MoreMenuDropdown;
