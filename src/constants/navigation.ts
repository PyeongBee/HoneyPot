/**
 * 네비게이션 관련 상수 정의
 */

import {
  Activity,
  FileText,
  LogIn,
  LogOut,
  Settings,
  User,
} from "lucide-react";

export const NAVIGATION = {
  LOGO_PATH: "/logo_Bee_lsh_clear_gra.png",
  LOGO_ALT: "로고",
  APP_NAME: "Waggle",
} as const;

// 메뉴 라벨 상수
export const MENU_LABELS = {
  EDITOR: "자소서 에디터",
  ACTIVITY: "내 활동",
  SETTINGS: "설정",
  LOGIN: "로그인",
  LOGOUT: "로그아웃",
  MORE: "더보기",
} as const;

// 메인 메뉴 아이템
export const MENU_ITEMS = [
  { icon: FileText, label: MENU_LABELS.EDITOR, href: "/editor" },
  // { icon: UserSearch, label: "스터디 목록", href: "/study" },
  // { icon: CircleUserRound, label: "프로필", href: "/profile" },
] as const;

// 인증 관련 메뉴 아이템
export const AUTH_MENU_ITEMS = {
  LOGIN: { icon: LogIn, label: MENU_LABELS.LOGIN, href: "/login" },
  LOGOUT: { icon: LogOut, label: MENU_LABELS.LOGOUT, href: "/logout" },
} as const;

// 더보기(프로필) 메뉴 아이템
export const MORE_MENU_ITEMS = [
  { icon: Activity, label: MENU_LABELS.ACTIVITY, href: "/activity" },
  { icon: Settings, label: MENU_LABELS.SETTINGS, href: "/settings" },
] as const;

// 비로그인 시 더보기 메뉴 아이템
export const MORE_MENU_ITEMS_GUEST = [
  { icon: Activity, label: MENU_LABELS.ACTIVITY, href: "/activity" },
  { icon: User, label: MENU_LABELS.LOGIN, href: "/login" },
] as const;
