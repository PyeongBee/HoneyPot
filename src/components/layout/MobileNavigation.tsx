"use client";

import { Activity, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  LONG_PRESS_DURATION,
  TOOLTIP_DISPLAY_DURATION,
} from "../../constants/editor";
import { MENU_ITEMS } from "../../constants/navigation";
import { signOut } from "../../lib/actions/auth";
import { useAuthStore } from "../../stores/authStore";
import { useConfirmStore } from "../../stores/confirmStore";
import { useToastStore } from "../../stores/toastStore";
import {
  cn,
  getMobileNavButtonClasses,
  mobileNavStyles,
} from "../../styles/components";

export default function MobileNavigation() {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const pathname = usePathname();
  const { showConfirm } = useConfirmStore();
  const { user, isAuthenticated, reset } = useAuthStore();
  const { addToast } = useToastStore();

  // 메뉴 아이템
  const menuItems = MENU_ITEMS;

  // 인증 상태 변경 시 프로필 메뉴 닫기
  useEffect(() => {
    setIsProfileMenuOpen(false);
  }, [isAuthenticated]);

  // 프로필 메뉴 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleLogout = async () => {
    try {
      reset();
      addToast("로그아웃되었습니다.", "success");
      await signOut();
    } catch (error) {
      if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
        throw error;
      }
      addToast("로그아웃에 실패했습니다.", "error");
    }
  };

  const handleProfileMenuClick = (href: string) => {
    setIsProfileMenuOpen(false);
    handleNavigation(href);
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <div className={cn(mobileNavStyles.container)}>
      <nav className={mobileNavStyles.nav}>
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;

          return (
            <div key={index} className="relative">
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

        {/* 프로필 메뉴 */}
        <div ref={profileMenuRef} className="relative">
          {/* 프로필 드롭다운 메뉴 */}
          {isProfileMenuOpen && user && (
            <div className="absolute bottom-full right-0 mb-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
              {/* 사용자 정보 */}
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user.user_metadata?.full_name || user.email}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </div>
              </div>

              {/* 메뉴 아이템 */}
              <button
                onClick={() => handleProfileMenuClick("/activity")}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Activity className="w-4 h-4" />
                <span>내 활동</span>
              </button>
              <button
                onClick={() => handleProfileMenuClick("/settings")}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>설정</span>
              </button>
              <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>로그아웃</span>
              </button>
            </div>
          )}

          {/* 프로필 버튼 */}
          <button
            onClick={() => {
              if (!user) {
                router.push("/login");
              } else {
                setIsProfileMenuOpen(!isProfileMenuOpen);
              }
            }}
            className={getMobileNavButtonClasses()}
            onMouseEnter={() => handleMouseEnter(menuItems.length)}
            onMouseLeave={handleMouseLeave}
            onTouchStart={() => handleTouchStart(menuItems.length)}
            onTouchEnd={handleTouchEnd}
          >
            {user ? (
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white text-xs font-bold">
                {getInitials(user.email || "")}
              </div>
            ) : (
              <User className={mobileNavStyles.icon} />
            )}
          </button>

          {/* 툴팁 */}
          {hoveredItem === menuItems.length && (
            <div className={cn(mobileNavStyles.tooltip.container)}>
              {user ? "프로필" : "로그인"}
              <div className={cn(mobileNavStyles.tooltip.arrow)}></div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
