/**
 * 공통 타입 정의
 * 컴포넌트별 Props는 각 컴포넌트 파일에서 정의
 */

import { LucideIcon } from "lucide-react";

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface MenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
}

export interface SpellCheckSuggestion {
  id: string;
  token: string;
  suggestions: string[];
  info: string;
  start: number;
  end: number;
  isChecked: boolean;
  selectedSuggestion?: string;
}
