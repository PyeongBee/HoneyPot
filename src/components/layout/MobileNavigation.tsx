"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LONG_PRESS_DURATION,
  TOOLTIP_DISPLAY_DURATION,
} from "../../constants/editor";
import { MENU_ITEMS, MENU_LABELS } from "../../constants/navigation";
import { useConfirmStore } from "../../stores/confirmStore";
import {
  cn,
  getMobileNavButtonClasses,
  mobileNavStyles,
} from "../../styles/components";
import MoreMenuDropdown from "../common/MoreMenuDropdown";

export default function MobileNavigation() {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { showConfirm } = useConfirmStore();

  // 통합된 메뉴 소스에서 가져오기
  const menuItems = MENU_ITEMS;

  const handleMouseEnter = (index: number) => {
    setHoveredItem(index);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const handleTouchStart = (index: number) => {
    const timer = setTimeout(() => {
      setHoveredItem(index);
    }, LONG_PRESS_DURATION); // 0.5초 후 툴팁 표시
    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    // 터치 종료 시 툴팁을 잠시 유지
    setTimeout(() => {
      setHoveredItem(null);
    }, TOOLTIP_DISPLAY_DURATION);
  };

  const handleNavigation = (href: string) => {
    if (pathname === "/editor") {
      // 에디터 페이지에서 나갈 때 확인
      const editorContent = sessionStorage.getItem("editorContent");
      const hasRealContent =
        editorContent &&
        editorContent.trim() &&
        editorContent.trim().length > 0;

      if (hasRealContent) {
        showConfirm({
          message:
            "입력한 내용이 있습니다. 정말 나가시겠습니까?\n저장되지 않은 내용은 사라집니다.",
          confirmText: "나가기",
          variant: "destructive",
          onConfirm: () => {
            sessionStorage.removeItem("editorContent");
            router.push(href);
          },
        });
      } else {
        router.push(href);
      }
    } else {
      router.push(href);
    }
  };

  const handleMoreMenuItemClick = (href: string) => {
    handleNavigation(href);
  };

  return (
    <div className={cn(mobileNavStyles.container)}>
      <nav className={mobileNavStyles.nav}>
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          const isMoreMenu = item.label === MENU_LABELS.MORE_MENU;

          return (
            <div key={index} className="relative">
              {isMoreMenu ? (
                <MoreMenuDropdown
                  position="bottom"
                  align="center"
                  showButton={false}
                  isOpen={isMoreMenuOpen}
                  onToggle={setIsMoreMenuOpen}
                  onItemClick={handleMoreMenuItemClick}
                />
              ) : null}

              {isMoreMenu ? (
                <button
                  onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                  className={getMobileNavButtonClasses()}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                  onTouchStart={() => handleTouchStart(index)}
                  onTouchEnd={handleTouchEnd}
                >
                  <IconComponent className={mobileNavStyles.icon} />
                </button>
              ) : (
                <Link
                  href={item.href}
                  onClick={e => {
                    e.preventDefault();
                    handleNavigation(item.href);
                  }}
                  className={getMobileNavButtonClasses()}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                  onTouchStart={() => handleTouchStart(index)}
                  onTouchEnd={handleTouchEnd}
                >
                  <IconComponent className={mobileNavStyles.icon} />
                </Link>
              )}

              {/* 툴팁 */}
              {hoveredItem === index && (
                <div className={cn(mobileNavStyles.tooltip.container)}>
                  {item.label}
                  <div className={cn(mobileNavStyles.tooltip.arrow)}></div>
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
