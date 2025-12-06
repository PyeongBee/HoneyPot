# 🐝 Waggle
벌이 꿀의 위치를 알릴 때 추는 '와글 댄스'(Waggle Dance)에서 비롯했다.

> 자소서 작성을 돕는 AI 기반 에디터 플랫폼

## 📋 목차

1. [프로젝트 개요](#-프로젝트-개요)
2. [기술 스택](#-기술-스택)
3. [폴더 구조](#-폴더-구조)
4. [디자인 시스템](#-디자인-시스템)
5. [코드 컨벤션](#-코드-컨벤션)
6. [코드 퀄리티 가이드](#-코드-퀄리티-가이드)
7. [개발 환경 설정](#-개발-환경-설정)
8. [상태 관리](#-상태-관리)
9. [스타일링 시스템](#-스타일링-시스템)
10. [명명 규칙](#-명명-규칙)

---

## 🎯 프로젝트 개요

### 프로젝트 톤앤 매너

**핵심 가치**

- **사용자 중심**: 직관적이고 편안한 UX
- **전문성**: 신뢰할 수 있는 AI 기반 교정 및 품질 검사
- **효율성**: 빠른 피드백과 실시간 반응
- **접근성**: 모바일/데스크톱 모두 최적화

**디자인 철학**

- 깔끔하고 미니멀한 UI
- 브랜드 컬러(골드/옐로우)를 포인트로 활용
- 다크모드 지원
- 부드러운 애니메이션과 트랜지션

**커뮤니케이션 스타일**

- 친근하되 전문적인 메시지
- 명확하고 간결한 에러 메시지
- 긍정적인 피드백 제공

---

## 🛠 기술 스택

### Core

- **Next.js 15.5.3** - App Router + React 19
- **TypeScript 5** - 타입 안전성
- **React 19.1.0** - 최신 React 기능 활용

### 스타일링

- **Tailwind CSS v4** - CSS 변수 기반 스타일링
- **lucide-react** - 일관된 아이콘 시스템
- **class-variance-authority** - 컴포넌트 variants 관리

### 상태 관리

- **Zustand 5** - 경량 상태 관리 라이브러리

### 유틸리티

- **hanspell** - 한글 맞춤법 검사
- **diff** - 텍스트 비교 및 변경사항 시각화
- **clsx** - 조건부 클래스 네임 관리

### 개발 도구

- **ESLint** - 코드 품질 검사
- **Prettier** - 코드 포맷팅
- **Turbopack** - 빠른 빌드

---

## 📁 폴더 구조

### 구조 철학

1. **기능별 그룹화**: 관련 파일들을 같은 폴더에 배치
2. **계층 최소화**: 3단계 이하의 깊이 유지
3. **명확한 책임 분리**: 각 폴더는 단일 목적을 가짐
4. **재사용성**: 공통 컴포넌트는 분리하여 관리

### 디렉토리 구조

```
src/
├── app/                        # Next.js App Router
│   ├── (pages)/                # 라우트 그룹
│   │   ├── editor/             # 에디터 페이지
│   │   │   ├── _components/    # 페이지 전용 컴포넌트 (외부 접근 불가)
│   │   │   │   ├── layout/     # 레이아웃 관련 컴포넌트
│   │   │   │   ├── Editor.tsx
│   │   │   │   ├── DiffViewer.tsx
│   │   │   │   └── ...
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   └── activity/
│   ├── api/                    # API Routes
│   │   ├── spell-check/
│   │   └── quality-check/
│   ├── globals.css             # 전역 스타일 + CSS 변수
│   ├── layout.tsx              # Root 레이아웃
│   └── page.tsx                # 홈 페이지
│
├── components/                 # 재사용 가능한 컴포넌트
│   ├── common/                 # 공통 UI 컴포넌트
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Toast.tsx
│   ├── layout/                 # 레이아웃 컴포넌트
│   │   ├── Sidebar.tsx
│   │   ├── MobileNavigation.tsx
│   │   └── sidebar/
│   └── lazy/                   # 지연 로딩 컴포넌트
│       └── index.tsx
│
├── hooks/                      # Custom React Hooks
│   ├── useEditorState.ts       # 에디터 상태 관리
│   ├── useSpellCheck.ts        # 맞춤법 검사
│   ├── useQualityCheck.ts      # 품질 검사
│   └── useTextCorrection.ts    # 텍스트 교정
│
├── stores/                     # Zustand 스토어
│   ├── sidebarStore.ts
│   ├── toastStore.ts
│   ├── spellCheckStore.ts
│   └── qualityCheckStore.ts
│
├── types/                      # TypeScript 타입 정의
│   ├── components.ts           # 컴포넌트 Props 타입
│   ├── editor.ts               # 에디터 관련 타입
│   ├── api.ts                  # API 응답 타입
│   └── index.ts                # 공통 타입
│
├── utils/                      # 유틸리티 함수
│   ├── textUtils.ts            # 텍스트 처리
│   ├── clipboardUtils.ts       # 클립보드 조작
│   └── correctionUtils.ts      # 교정 관련 유틸
│
├── constants/                  # 상수 정의
│   ├── navigation.ts           # 네비게이션 상수
│   ├── messages.ts             # 메시지 상수
│   └── editor.ts               # 에디터 설정 상수
│
└── styles/                     # 스타일 시스템
    ├── components.ts           # 컴포넌트 스타일 variants
    └── README.md               # 스타일 가이드
```

### 폴더별 역할

#### `app/(pages)/[페이지]/_components/`

- 해당 페이지에서만 사용되는 컴포넌트
- `_` 접두사로 외부 접근 방지
- 페이지별 로직과 밀접하게 연관
- **최대 200라인 준수**

#### `components/common/`

- 프로젝트 전체에서 재사용 가능
- 비즈니스 로직 최소화
- Props를 통한 완전한 제어
- **단일 책임 원칙 엄격히 준수**

#### `hooks/`

- 재사용 가능한 로직 추상화
- 하나의 hook은 하나의 책임
- 명확한 반환 값과 파라미터

#### `stores/`

- 전역 상태 관리
- 도메인별로 스토어 분리
- Actions와 State 명확히 구분

#### `types/`

- 타입 정의만 포함
- 로직 코드 포함 금지
- 도메인별로 파일 분리

#### `utils/`

- 순수 함수로 구성
- Side effect 최소화
- 테스트 가능한 형태

#### `constants/`

- 하드코딩된 값 방지
- `as const` assertion 사용
- 의미 있는 상수명

---

## 🎨 디자인 시스템

### 색상 시스템

#### 브랜드 컬러

```css
--color-brand-400: #fbbf24; /* Light Gold */
--color-brand-500: #f59e0b; /* Primary Gold */
--color-brand-600: #d97706; /* Dark Gold */
--color-brand-700: #b45309; /* Darker Gold */
```

#### 시맨틱 컬러

```css
--color-success-500: #10b981; /* Success */
--color-warning-500: #f59e0b; /* Warning */
--color-error-500: #ef4444; /* Error */
--color-info-500: #3b82f6; /* Info */
```

#### 그레이스케일

- `gray-50` ~ `gray-900`
- 다크모드 자동 대응

### 타이포그래피

- **본문**: `text-sm` (14px), `text-base` (16px)
- **제목**: `text-lg` (18px), `text-xl` (20px), `text-2xl` (24px)
- **행간**: `leading-relaxed` (1.625) 기본 사용

### 간격 시스템

- **여백**: 4px 단위 (1, 2, 3, 4, 6, 8, 12, 16, 24)
- **패딩**: `p-4` (16px), `p-6` (24px) 자주 사용
- **갭**: `gap-2` (8px), `gap-4` (16px) 주로 사용

### 컴포넌트 Variants

#### Button

```typescript
variants: "default" |
  "destructive" |
  "outline" |
  "secondary" |
  "ghost" |
  "link";
sizes: "sm" | "md" | "lg";
```

#### Input

```typescript
sizes: "sm" | "md" | "lg";
states: "default" | "error" | "success";
```

### 애니메이션

- **Transition Duration**: 200ms (기본)
- **Easing**: `ease-in-out` (기본), `ease-out` (나타남)
- **Hover Effect**: `scale-105`, `opacity` 변화
- **Focus Ring**: `ring-2 ring-brand-500`

---

## 📝 코드 컨벤션

### TypeScript 컨벤션

#### 1. 타입 정의

```typescript
// ✅ 좋은 예
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

type ButtonVariant = "default" | "outline" | "ghost";

// ❌ 나쁜 예
interface UserProfile {
  id: any; // any 사용 금지
  name; // 타입 생략 금지
}
```

#### 2. Props 타입

```typescript
// ✅ 좋은 예
interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

// ❌ 나쁜 예
interface ButtonProps {
  [key: string]: any; // 너무 느슨함
}
```

#### 3. 함수 시그니처

```typescript
// ✅ 좋은 예
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ❌ 나쁜 예
function calculateTotal(items) {
  // 타입 명시 없음
  return items.reduce((sum, item) => sum + item.price, 0);
}
```

### React 컨벤션

#### 1. 컴포넌트 구조

```typescript
// ✅ 표준 컴포넌트 구조
'use client';  // 필요한 경우만

import { useState } from 'react';
import { type ComponentProps } from '@/types';

interface MyComponentProps {
  // Props 타입 정의
}

export default function MyComponent({ prop1, prop2 }: MyComponentProps) {
  // 1. Hooks
  const [state, setState] = useState();

  // 2. Handlers
  const handleClick = () => {};

  // 3. Effects
  useEffect(() => {}, []);

  // 4. Render
  return <div>...</div>;
}
```

#### 2. Hooks 사용

```typescript
// ✅ 좋은 예
const { data, isLoading, error } = useQuery();

// ❌ 나쁜 예
const result = useQuery(); // 구조 분해 할당 사용
```

#### 3. 조건부 렌더링

```typescript
// ✅ 좋은 예
{isLoading && <Spinner />}
{error && <ErrorMessage message={error} />}
{data && <DataList items={data} />}

// ❌ 나쁜 예
{isLoading ? <Spinner /> : null}  // 불필요한 삼항 연산자
```

### Import 순서

```typescript
// 1. React 관련
import { useState, useEffect } from "react";

// 2. 외부 라이브러리
import { clsx } from "clsx";

// 3. 내부 절대 경로
import { Button } from "@/components/common/Button";
import { useAuth } from "@/hooks/useAuth";
import { type User } from "@/types";

// 4. 상대 경로
import { LocalComponent } from "./LocalComponent";
```

### 파일 명명 규칙

#### 컴포넌트

- PascalCase 사용: `Button.tsx`, `UserProfile.tsx`
- 한 파일에 하나의 컴포넌트
- default export 사용

#### Hooks

- camelCase 사용: `useAuth.ts`, `useEditorState.ts`
- `use` 접두사 필수

#### Utils

- camelCase 사용: `textUtils.ts`, `dateUtils.ts`
- 도메인별로 파일 분리

#### Types

- camelCase 사용: `editor.ts`, `components.ts`
- 도메인별로 파일 분리

#### Constants

- camelCase 사용: `navigation.ts`, `messages.ts`
- 상수는 UPPER_SNAKE_CASE

---

## ✨ 코드 퀄리티 가이드

### 핵심 원칙

#### 1. **파일 크기 제한: 최대 200라인**

**이유**

- 코드 가독성 향상
- 유지보수 용이성
- 테스트 편의성
- 멘탈 모델 단순화

**초과 시 대처법**

```typescript
// ❌ 나쁜 예: 300라인의 거대 컴포넌트
export default function EditorPage() {
  // 100줄의 상태 관리
  // 100줄의 이벤트 핸들러
  // 100줄의 렌더링 로직
}

// ✅ 좋은 예: 분리된 컴포넌트
export default function EditorPage() {
  return (
    <EditorLayout>
      <EditorHeader />
      <EditorContent />
      <EditorSidebar />
    </EditorLayout>
  );
}
```

#### 2. **단일 책임 원칙 (Single Responsibility Principle)**

**컴포넌트**

```typescript
// ❌ 나쁜 예: 여러 책임
function UserDashboard() {
  // API 호출
  // 상태 관리
  // 데이터 가공
  // UI 렌더링
  // 에러 처리
}

// ✅ 좋은 예: 책임 분리
function UserDashboard() {
  const { data, isLoading, error } = useUserData();  // 데이터 로직 분리

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <UserDataView data={data} />;  // UI 렌더링만
}
```

**Hooks**

```typescript
// ❌ 나쁜 예: 여러 책임
function useEditor() {
  // 텍스트 편집
  // 맞춤법 검사
  // 품질 검사
  // 히스토리 관리
  // 자동 저장
}

// ✅ 좋은 예: 분리된 hooks
function useEditor() {
  const text = useEditorText();
  const spellCheck = useSpellCheck(text);
  const qualityCheck = useQualityCheck(text);
  const history = useEditorHistory();
  const autoSave = useAutoSave(text);

  return { text, spellCheck, qualityCheck, history, autoSave };
}
```

#### 3. **함수 크기: 최대 50라인**

```typescript
// ✅ 좋은 예: 작은 함수
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password: string): boolean {
  return password.length >= 8 && /[A-Z]/.test(password);
}

function validateUser(user: User): ValidationResult {
  return {
    email: validateEmail(user.email),
    password: validatePassword(user.password),
  };
}
```

#### 4. **Early Return 패턴**

```typescript
// ✅ 좋은 예
function processUser(user: User | null) {
  if (!user) return null;
  if (!user.isActive) return null;
  if (!user.hasPermission) return null;

  return processActiveUser(user);
}

// ❌ 나쁜 예
function processUser(user: User | null) {
  if (user) {
    if (user.isActive) {
      if (user.hasPermission) {
        return processActiveUser(user);
      }
    }
  }
  return null;
}
```

#### 5. **순수 함수 선호**

```typescript
// ✅ 좋은 예: 순수 함수
function addItem(items: Item[], newItem: Item): Item[] {
  return [...items, newItem];
}

// ❌ 나쁜 예: 사이드 이펙트
function addItem(items: Item[], newItem: Item) {
  items.push(newItem); // 원본 수정
  return items;
}
```

### 코드 리뷰 체크리스트

#### 필수 확인 사항

- [ ] 파일이 200라인 이하인가?
- [ ] 각 함수가 하나의 책임만 가지는가?
- [ ] 타입이 명확히 정의되었는가?
- [ ] Early return 패턴을 사용했는가?
- [ ] 매직 넘버 대신 상수를 사용했는가?
- [ ] 에러 처리가 적절한가?
- [ ] 주석이 필요한 복잡한 로직이 있는가?

#### 리팩토링이 필요한 신호

- 함수가 50라인을 넘어감
- 파일이 200라인을 넘어감
- if/else가 3단계 이상 중첩
- 같은 코드가 3번 이상 반복
- 함수명만으로 기능을 이해하기 어려움

---

## 🚀 개발 환경 설정

### 필수 확장 프로그램 (VSCode/Cursor)

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss"
  ]
}
```

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (Turbopack)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

### 코드 품질 관리

```bash
# 린트 검사
npm run lint

# 린트 자동 수정
npm run lint:fix

# 코드 포맷팅
npm run format

# 포맷팅 검사
npm run format:check

# 타입 검사
npm run type-check

# 모든 검사 실행
npm run check-all
```

### 자동 포맷팅 설정

프로젝트 루트에 `.vscode/settings.json` 생성:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  }
}
```

---

## 🗂 상태 관리

### Zustand 스토어 패턴

```typescript
// ✅ 표준 스토어 구조
import { create } from "zustand";

interface StoreState {
  // State 타입 정의
  data: Data[];
  isLoading: boolean;
  error: string | null;
}

interface StoreActions {
  // Actions 타입 정의
  fetchData: () => Promise<void>;
  updateData: (id: string, data: Partial<Data>) => void;
  reset: () => void;
}

type Store = StoreState & StoreActions;

const initialState: StoreState = {
  data: [],
  isLoading: false,
  error: null,
};

export const useDataStore = create<Store>((set, get) => ({
  ...initialState,

  fetchData: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await api.fetchData();
      set({ data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateData: (id, updates) => {
    set({
      data: get().data.map(item =>
        item.id === id ? { ...item, ...updates } : item
      ),
    });
  },

  reset: () => set(initialState),
}));
```

### 스토어 사용 가이드

#### 1. 필요한 값만 구독

```typescript
// ✅ 좋은 예
const data = useDataStore(state => state.data);
const fetchData = useDataStore(state => state.fetchData);

// ❌ 나쁜 예 (불필요한 리렌더링)
const store = useDataStore();
```

#### 2. 스토어 분리 기준

- 도메인별로 분리 (user, editor, ui 등)
- 라이프사이클이 다른 상태는 분리
- 너무 작게 나누지 않기 (관련 있는 상태는 묶기)

---

## 🎨 스타일링 시스템

### Tailwind CSS v4 + CSS 변수

#### 1. CSS 변수 정의 (`app/globals.css`)

```css
@theme {
  /* 브랜드 컬러 */
  --color-brand-400: #fbbf24;
  --color-brand-500: #f59e0b;
  --color-brand-600: #d97706;

  /* 시맨틱 컬러 */
  --color-success-500: #10b981;
  --color-error-500: #ef4444;
}
```

#### 2. 스타일 Variants 시스템

```typescript
// styles/components.ts에서 import
import { getButtonClasses } from '@/styles/components';

// 컴포넌트에서 사용
<button className={getButtonClasses('default', 'md')}>
  클릭
</button>
```

#### 3. 조건부 스타일링

```typescript
import { cn } from '@/styles/components';

<div className={cn(
  'base-class',
  isActive && 'active-class',
  isPrimary ? 'primary-class' : 'secondary-class',
  className  // Props로 받은 클래스
)} />
```

### 반응형 디자인

```typescript
// 모바일 우선 접근
<div className="
  px-4           // 모바일
  md:px-6        // 태블릿
  lg:px-8        // 데스크톱
">
```

### 다크모드

```typescript
// 자동 적용되는 dark: variant 사용
<div className="
  bg-white
  dark:bg-gray-900
  text-gray-900
  dark:text-white
">
```

---

## 📛 명명 규칙

### 변수명

#### Boolean

```typescript
// is, has, can, should 접두사 사용
const isLoading = true;
const hasError = false;
const canEdit = true;
const shouldRender = false;
```

#### 배열/리스트

```typescript
// 복수형 사용
const users = [];
const items = [];
const menuItems = [];
```

#### 객체

```typescript
// 단수형 사용
const user = {};
const config = {};
const settings = {};
```

### 함수명

#### 이벤트 핸들러

```typescript
// handle 접두사 사용
const handleClick = () => {};
const handleSubmit = () => {};
const handleChange = () => {};
```

#### 데이터 가져오기

```typescript
// get, fetch 접두사
const getUserData = () => {};
const fetchPosts = async () => {};
```

#### 상태 업데이트

```typescript
// set, update, toggle
const setName = () => {};
const updateProfile = () => {};
const toggleSidebar = () => {};
```

#### 검증

```typescript
// validate, check, verify, is
const validateEmail = () => {};
const checkPermission = () => {};
const isValidUser = () => {};
```

### 컴포넌트명

```typescript
// 명사 + 역할
Button; // UI 컴포넌트
UserProfile; // 도메인 컴포넌트
EditorSidebar; // 레이아웃 컴포넌트
LoadingSpinner; // 상태 컴포넌트
```

### 상수명

```typescript
// UPPER_SNAKE_CASE
const MAX_LENGTH = 100;
const API_BASE_URL = 'https://api.example.com';
const DEFAULT_TIMEOUT = 5000;

// 객체는 PascalCase
export const MENU_ITEMS = [...] as const;
export const COLORS = {...} as const;
```

---

## 📚 추가 리소스

### 관련 문서

- [스타일 시스템 가이드](./src/styles/README.md)
- [Next.js 공식 문서](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Zustand 문서](https://zustand-demo.pmnd.rs/)

### 개발 팁

#### 성능 최적화

- `React.memo()` 사용 시 신중하게 (측정 후 적용)
- 동적 import로 코드 스플리팅
- 이미지는 `next/image` 사용

#### 접근성

- 시맨틱 HTML 사용
- ARIA 속성 적절히 사용
- 키보드 네비게이션 지원

#### 보안

- XSS 방지: 사용자 입력 sanitize
- CSRF 토큰 사용
- 환경 변수로 민감 정보 관리

---

**Last Updated**: 2025-10-27  
**Version**: 0.1.0
