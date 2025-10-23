/**
 * 컴포넌트 스타일 variants 시스템
 * Tailwind CSS v4와 CSS 변수를 활용한 현대적인 스타일링 방식
 */

import { clsx, type ClassValue } from 'clsx';

// 유틸리티 함수
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Button 스타일 시스템
export const buttonStyles = {
  base: [
    'inline-flex items-center justify-center rounded-md font-medium transition-colors duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-50',
  ],
  variants: {
    default: 'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700',
    destructive: 'bg-error-500 text-white hover:bg-error-600 active:bg-error-700',
    outline: [
      'border border-gray-300 bg-transparent hover:bg-gray-50 active:bg-gray-100',
      'dark:border-gray-600 dark:hover:bg-gray-800 dark:active:bg-gray-700',
    ],
    secondary: [
      'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300',
      'dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 dark:active:bg-gray-600',
    ],
    ghost: [
      'hover:bg-gray-100 active:bg-gray-200',
      'dark:hover:bg-gray-800 dark:active:bg-gray-700',
    ],
    link: 'text-brand-500 underline-offset-4 hover:underline',
  },
  sizes: {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4',
    lg: 'h-12 px-6 text-lg',
  },
} as const;

// Input 스타일 시스템
export const inputStyles = {
  base: [
    'flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm transition-colors duration-200',
    'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500',
  ],
  sizes: {
    sm: 'h-8 text-xs',
    md: 'h-10 text-sm',
    lg: 'h-12 text-base',
  },
  states: {
    default: '',
    error: 'border-error-500 focus:ring-error-500',
    success: 'border-success-500 focus:ring-success-500',
  },
} as const;

// Card 스타일 시스템
export const cardStyles = {
  base: [
    'rounded-lg border border-gray-200 bg-white transition-shadow duration-200',
    'dark:border-gray-700 dark:bg-gray-800',
  ],
  padding: {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  },
  shadows: {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  },
} as const;

// Toggle Switch 스타일 시스템
export const toggleSwitchStyles = {
  base: [
    'relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out p-0.5 cursor-pointer',
    'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ],
  sizes: {
    sm: 'w-8 h-4',
    md: 'w-12 h-6',
    lg: 'w-16 h-8',
  },
  states: {
    checked: 'bg-gradient-to-r from-brand-400 to-brand-500',
    unchecked: 'bg-gray-300 dark:bg-gray-600',
  },
} as const;

export const toggleThumbStyles = {
  base: 'inline-block rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out',
  sizes: {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  },
  positions: {
    sm: {
      checked: 'translate-x-4',
      unchecked: 'translate-x-0',
    },
    md: {
      checked: 'translate-x-6',
      unchecked: 'translate-x-0',
    },
    lg: {
      checked: 'translate-x-8',
      unchecked: 'translate-x-0',
    },
  },
} as const;

// Toast 스타일 시스템
export const toastStyles = {
  base: [
    'group pointer-events-auto flex w-full items-center justify-between space-x-4',
    'overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all duration-300',
  ],
  variants: {
    default: [
      'border-gray-200 bg-white text-gray-900',
      'dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100',
    ],
    destructive: [
      'border-error-500 bg-error-50 text-error-900',
      'dark:border-error-600 dark:bg-error-900 dark:text-error-100',
    ],
    success: [
      'border-success-500 bg-success-50 text-success-900',
      'dark:border-success-600 dark:bg-success-900 dark:text-success-100',
    ],
    warning: [
      'border-warning-500 bg-warning-50 text-warning-900',
      'dark:border-warning-600 dark:bg-warning-900 dark:text-warning-100',
    ],
  },
} as const;

// 헬퍼 함수들
export function getButtonClasses(
  variant: keyof typeof buttonStyles.variants = 'default',
  size: keyof typeof buttonStyles.sizes = 'md',
  className?: string
) {
  return cn(buttonStyles.base, buttonStyles.variants[variant], buttonStyles.sizes[size], className);
}

export function getInputClasses(
  size: keyof typeof inputStyles.sizes = 'md',
  state: keyof typeof inputStyles.states = 'default',
  className?: string
) {
  return cn(inputStyles.base, inputStyles.sizes[size], inputStyles.states[state], className);
}

export function getCardClasses(
  padding: keyof typeof cardStyles.padding = 'md',
  shadow: keyof typeof cardStyles.shadows = 'sm',
  className?: string
) {
  return cn(cardStyles.base, cardStyles.padding[padding], cardStyles.shadows[shadow], className);
}

export function getToggleSwitchClasses(
  size: keyof typeof toggleSwitchStyles.sizes = 'md',
  checked: boolean = false,
  className?: string
) {
  return cn(
    toggleSwitchStyles.base,
    toggleSwitchStyles.sizes[size],
    checked ? toggleSwitchStyles.states.checked : toggleSwitchStyles.states.unchecked,
    className
  );
}

export function getToggleThumbClasses(
  size: keyof typeof toggleThumbStyles.sizes = 'md',
  checked: boolean = false,
  className?: string
) {
  return cn(
    toggleThumbStyles.base,
    toggleThumbStyles.sizes[size],
    checked 
      ? toggleThumbStyles.positions[size].checked 
      : toggleThumbStyles.positions[size].unchecked,
    className
  );
}

export function getToastClasses(
  variant: keyof typeof toastStyles.variants = 'default',
  className?: string
) {
  return cn(toastStyles.base, toastStyles.variants[variant], className);
}

export function getSidebarClasses(
  isCollapsed: boolean = false,
  className?: string
) {
  return cn(
    sidebarStyles.base,
    isCollapsed ? sidebarStyles.widths.collapsed : sidebarStyles.widths.expanded,
    className
  );
}

export function getDropdownClasses(
  position: 'top' | 'bottom' = 'top',
  align: 'left' | 'center' | 'right' = 'left',
  isCollapsed?: boolean,
  className?: string
) {
  return cn(
    dropdownStyles.base,
    dropdownStyles.positions[position],
    align === 'center' ? dropdownStyles.alignments.center :
    align === 'right' ? dropdownStyles.alignments.right :
    isCollapsed !== undefined ? 
      (isCollapsed ? dropdownStyles.sidebarAlignments.collapsed : dropdownStyles.sidebarAlignments.expanded) :
      dropdownStyles.alignments.left,
    className
  );
}

export function getDropdownArrowClasses(
  position: 'top' | 'bottom' = 'top',
  align: 'left' | 'center' | 'right' = 'left'
) {
  return cn(
    dropdownStyles.arrow.base,
    position === 'bottom' ? dropdownStyles.arrow.bottom : dropdownStyles.arrow.top,
    align === 'center' ? dropdownStyles.arrow.center : dropdownStyles.arrow.left
  );
}

export function getMobileNavButtonClasses(className?: string) {
  return cn(mobileNavStyles.button, className);
}

export function getSidebarMenuItemClasses(
  isCollapsed: boolean = false,
  className?: string
) {
  return cn(
    sidebarMenuItemStyles.base,
    isCollapsed ? sidebarMenuItemStyles.collapsed : sidebarMenuItemStyles.expanded,
    className
  );
}

// 사이드바 스타일 시스템
export const sidebarStyles = {
  base: [
    'bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700',
    'transition-all duration-300 relative h-full flex flex-col',
  ],
  widths: {
    collapsed: 'w-16',
    expanded: 'w-64',
  },
  logo: {
    size: 48,
  },
} as const;

// 드롭다운 스타일 시스템
export const dropdownStyles = {
  base: [
    'absolute bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 w-48',
    'transition-all duration-200 ease-out transform opacity-100 scale-100',
  ],
  positions: {
    top: 'top-full mt-2',
    bottom: 'bottom-full mb-2',
  },
  alignments: {
    left: 'left-0',
    center: 'left-1/2 transform -translate-x-1/2',
    right: 'right-0',
  },
  sidebarAlignments: {
    collapsed: 'left-12',
    expanded: 'left-full ml-2',
  },
  menuItem: [
    'flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300',
    'hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
  ],
  divider: 'border-t border-gray-200 dark:border-gray-600 my-1',
  arrow: {
    base: 'absolute w-0 h-0 border-l-2 border-r-2 border-transparent',
    top: 'bottom-full border-b-2 border-b-white dark:border-b-gray-800',
    bottom: 'top-full border-t-2 border-t-white dark:border-t-gray-800',
    center: 'left-1/2 transform -translate-x-1/2',
    left: 'left-6',
  },
} as const;

// 모바일 네비게이션 스타일 시스템
export const mobileNavStyles = {
  container: [
    'fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900',
    'border-t border-gray-200 dark:border-gray-700 md:hidden z-50 shadow-lg',
  ],
  nav: 'flex justify-around py-1',
  button: [
    'flex items-center justify-center w-10 h-10 rounded-lg',
    'transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800',
    'hover:scale-105 active:scale-95',
  ],
  icon: 'w-6 h-6 text-gray-600 dark:text-gray-400',
  tooltip: {
    container: [
      'absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2',
      'px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded whitespace-nowrap z-10',
    ],
    arrow: [
      'absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0',
      'border-l-2 border-r-2 border-t-2 border-transparent',
      'border-t-gray-900 dark:border-t-gray-700',
    ],
  },
} as const;

// 사이드바 메뉴 아이템 스타일 시스템
export const sidebarMenuItemStyles = {
  base: [
    'flex items-center rounded-lg transition-all duration-200 w-full text-left',
    'hover:bg-gray-100 dark:hover:bg-gray-800 hover:scale-105',
  ],
  collapsed: 'justify-center h-10 px-2',
  expanded: 'h-10 px-3',
  icon: {
    container: 'flex items-center justify-center w-5 h-5 flex-shrink-0',
    size: 'w-5 h-5 text-gray-600 dark:text-gray-400',
  },
  label: 'text-gray-700 dark:text-gray-300 ml-3 text-sm leading-5 truncate flex-1',
} as const;

// 토스트 시간 상수
export const TOAST_DURATIONS = {
  DEFAULT: 3000, // 3초
  SUCCESS: 3000, // 3초
  ERROR: 5000,   // 5초 (에러는 좀 더 길게)
  INFO: 4000,    // 4초
  ANIMATION: 300, // 0.3초
} as const;

// 타입 정의
export type ButtonVariant = keyof typeof buttonStyles.variants;
export type ButtonSize = keyof typeof buttonStyles.sizes;
export type InputSize = keyof typeof inputStyles.sizes;
export type InputState = keyof typeof inputStyles.states;
export type CardPadding = keyof typeof cardStyles.padding;
export type CardShadow = keyof typeof cardStyles.shadows;
export type ToggleSize = keyof typeof toggleSwitchStyles.sizes;
export type ToastVariant = keyof typeof toastStyles.variants;
export type SidebarWidth = keyof typeof sidebarStyles.widths;
