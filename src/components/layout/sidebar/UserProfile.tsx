"use client";

import { signOut } from "@/lib/actions/auth";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";
import { Activity, ChevronDown, LogOut, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface UserProfileProps {
  isCollapsed: boolean;
}

export default function UserProfile({ isCollapsed }: UserProfileProps) {
  const router = useRouter();
  const { user, isAuthenticated, reset } = useAuthStore();
  const { addToast } = useToastStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 인증 상태 변경 시 드롭다운 닫기 (로그인/로그아웃 시 메뉴 상태 초기화)
  useEffect(() => {
    setIsOpen(false);
  }, [isAuthenticated]);

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 로그인하지 않은 경우
  if (!user) {
    return (
      <div className="border-t border-gray-200 dark:border-gray-700 p-3">
        <button
          onClick={() => router.push("/login")}
          className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors ${
            isCollapsed ? "justify-center" : ""
          }`}
          title="로그인"
        >
          <User className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>로그인</span>}
        </button>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      // authStore 상태 초기화 (토스트 스토어도 함께 초기화됨)
      reset();
      // 로그아웃 성공 토스트 추가
      addToast("로그아웃되었습니다.", "success");
      // 로그아웃 및 리다이렉트
      await signOut();
    } catch (error) {
      // redirect 에러는 정상적인 동작이므로 다시 throw
      if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
        throw error;
      }
      addToast("로그아웃에 실패했습니다.", "error");
    }
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const displayName = user.user_metadata?.full_name || user.email;
  const initials = getInitials(user.email || "");

  return (
    <div
      className="border-t border-gray-200 dark:border-gray-700 p-3"
      ref={dropdownRef}
    >
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors ${
            isCollapsed ? "justify-center" : ""
          }`}
          title={displayName}
        >
          {/* 아바타 */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials}
          </div>

          {!isCollapsed && (
            <>
              <div className="flex-1 text-left overflow-hidden">
                <div className="truncate text-sm font-semibold">
                  {displayName}
                </div>
                <div className="truncate text-xs text-gray-500 dark:text-gray-400">
                  {user.email}
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform flex-shrink-0 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </>
          )}
        </button>

        {/* 드롭다운 메뉴 */}
        {isOpen && !isCollapsed && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/activity");
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Activity className="w-4 h-4" />
              <span>내 활동</span>
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/settings");
              }}
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

        {/* Collapsed 상태에서의 툴팁 메뉴 */}
        {isOpen && isCollapsed && (
          <div className="absolute bottom-0 left-full ml-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50 min-w-[200px]">
            <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {displayName}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user.email}
              </div>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/activity");
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Activity className="w-4 h-4" />
              <span>내 활동</span>
            </button>
            <button
              onClick={() => {
                setIsOpen(false);
                router.push("/settings");
              }}
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
      </div>
    </div>
  );
}
