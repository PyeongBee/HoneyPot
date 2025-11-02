/**
 * 네비게이션 관련 상수 정의
 */

import { FileText, LogIn, LogOut } from "lucide-react";

export const NAVIGATION = {
  LOGO_PATH: "/logo_Bee_lsh_clear_gra.png",
  LOGO_ALT: "로고",
  APP_NAME: "평비의 꿀단지",
} as const;

// 메뉴 라벨 상수
export const MENU_LABELS = {
  EDITOR: "자소서 에디터",
  ACTIVITY: "내활동",
  SETTINGS: "설정",
  LOGIN: "로그인",
  LOGOUT: "로그아웃",
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
