# 🏗️ 인증 시스템 아키텍처

Waggle 프로젝트의 인증 시스템 설계 및 구현 상세 문서입니다.

## 📐 아키텍처 개요

```
┌─────────────────────────────────────────────────────────────┐
│                         Client (Browser)                     │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ Login Page  │  │ Signup Page  │  │ Protected Pages  │   │
│  └─────────────┘  └──────────────┘  └──────────────────┘   │
│         │                 │                    │             │
│         └─────────────────┴────────────────────┘             │
│                           │                                  │
│                    ┌──────▼────────┐                        │
│                    │  useAuth Hook │                        │
│                    │  (Client)     │                        │
│                    └──────┬────────┘                        │
│                           │                                  │
└───────────────────────────┼──────────────────────────────────┘
                            │
                    ┌───────▼────────┐
                    │ Supabase Client│
                    │ (Browser)      │
                    └───────┬────────┘
                            │
┌───────────────────────────┼──────────────────────────────────┐
│                    Next.js Middleware                         │
├───────────────────────────┼──────────────────────────────────┤
│                    ┌──────▼────────┐                         │
│                    │ updateSession │                         │
│                    │ (Middleware)  │                         │
│                    └──────┬────────┘                         │
│                           │                                   │
│           ┌───────────────┼───────────────┐                  │
│           │               │               │                  │
│    ┌──────▼──────┐ ┌─────▼──────┐ ┌─────▼────────┐         │
│    │   Protect   │ │  Redirect  │ │Session Refresh│        │
│    │   Routes    │ │  Logged-in │ │              │         │
│    └─────────────┘ └────────────┘ └──────────────┘         │
└──────────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────┼──────────────────────────────────┐
│                     Server Components                         │
├───────────────────────────┼──────────────────────────────────┤
│                    ┌──────▼────────┐                         │
│                    │Server Actions │                         │
│                    │  (auth.ts)    │                         │
│                    └──────┬────────┘                         │
│                           │                                   │
│    ┌──────────────────────┼──────────────────────┐           │
│    │                      │                      │           │
│ ┌──▼─────┐  ┌───────────▼──────────┐  ┌────────▼────────┐  │
│ │ signUp │  │ signIn/signOut      │  │ resetPassword   │  │
│ └────────┘  └──────────────────────┘  └─────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                            │
                    ┌───────▼────────┐
                    │   Supabase     │
                    │   Auth API     │
                    └───────┬────────┘
                            │
                    ┌───────▼────────┐
                    │   PostgreSQL   │
                    │   Database     │
                    └────────────────┘
```

---

## 🗂️ 파일 구조

```
src/
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # 클라이언트 컴포넌트용
│   │   ├── server.ts          # 서버 컴포넌트용
│   │   └── middleware.ts      # 미들웨어용
│   └── actions/
│       └── auth.ts            # Server Actions
├── stores/
│   └── authStore.ts           # Zustand 인증 상태 관리
├── hooks/
│   └── useAuth.ts             # 인증 Hook
├── types/
│   └── auth.ts                # 인증 타입 정의
├── app/
│   ├── (auth)/                # 인증 페이지 그룹
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   ├── reset-password/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   └── api/
│       └── auth/
│           └── callback/
│               └── route.ts   # OAuth 콜백
└── components/
    └── layout/
        └── sidebar/
            └── UserProfile.tsx # 사용자 프로필 UI

middleware.ts                   # 라우트 보호
```

---

## 🔑 핵심 컴포넌트

### 1. Supabase 클라이언트 (3가지 버전)

#### 1.1 클라이언트 컴포넌트용 (`client.ts`)

```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**용도**:

- `"use client"` 컴포넌트에서 사용
- OAuth 로그인
- 실시간 인증 상태 구독

**특징**:

- 브라우저 환경에서 실행
- 자동 쿠키 관리
- `onAuthStateChange` 리스너 지원

#### 1.2 서버 컴포넌트용 (`server.ts`)

```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: cookiesToSet => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );
}
```

**용도**:

- Server Components
- Server Actions
- API Routes

**특징**:

- 서버에서만 실행
- 쿠키를 통한 세션 관리
- RLS (Row Level Security) 적용

#### 1.3 미들웨어용 (`middleware.ts`)

```typescript
export async function updateSession(request: NextRequest) {
  // 세션 갱신
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 인증 체크 및 리다이렉트
  if (isProtectedPath && !user) {
    return NextResponse.redirect("/login");
  }

  return supabaseResponse;
}
```

**용도**:

- 라우트 보호
- 세션 자동 갱신
- 인증 기반 리다이렉트

**특징**:

- 모든 요청에서 실행
- 쿠키 읽기/쓰기
- Edge Runtime 호환

---

### 2. 인증 상태 관리 (Zustand)

```typescript
export const useAuthStore = create<AuthStoreState>(set => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: user =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),

  setLoading: isLoading => set({ isLoading }),

  reset: () =>
    set({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    }),
}));
```

**장점**:

- 전역 상태 관리
- TypeScript 타입 안전성
- 리렌더링 최적화
- 간단한 API

---

### 3. useAuth Hook

```typescript
export function useAuth() {
  const { user, setUser } = useAuthStore();
  const supabase = createClient();

  useEffect(() => {
    // 초기 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // 인증 상태 변경 구독
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      router.refresh();
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, signInWithOAuth };
}
```

**역할**:

- 인증 상태 초기화
- 실시간 상태 동기화
- OAuth 로그인 처리

---

### 4. Server Actions

```typescript
"use server";

export async function signIn(data: SignInData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) return { success: false, error };

  revalidatePath("/", "layout");
  return { success: true };
}
```

**특징**:

- 서버에서만 실행
- 타입 안전성
- 자동 데이터 재검증
- Progressive Enhancement

---

## 🔐 보안 기능

### 1. Row Level Security (RLS)

```sql
-- 사용자는 자신의 데이터만 접근 가능
CREATE POLICY "Users can view own data"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);
```

### 2. Protected Routes

```typescript
// middleware.ts
const protectedPaths = ["/editor", "/activity"];

if (protectedPaths.includes(pathname) && !user) {
  return NextResponse.redirect("/login");
}
```

### 3. CSRF 보호

- Supabase가 자동으로 처리
- 쿠키 기반 세션 관리
- `SameSite=Lax` 설정

### 4. XSS 보호

- React의 자동 이스케이핑
- CSP (Content Security Policy) 설정 권장

---

## 🔄 인증 플로우

### 1. 이메일/비밀번호 로그인

```
┌──────┐      ┌────────────┐      ┌──────────┐      ┌──────────┐
│ User │─────▶│ Login Form │─────▶│  signIn  │─────▶│ Supabase │
└──────┘      └────────────┘      │ (Server) │      │   Auth   │
                                   └──────────┘      └──────────┘
                                         │                 │
                                         ▼                 ▼
                                   ┌──────────┐      ┌──────────┐
                                   │ Redirect │◀─────│  Token   │
                                   │  /editor │      │  Issued  │
                                   └──────────┘      └──────────┘
```

### 2. OAuth 로그인 (Google/GitHub)

```
┌──────┐      ┌──────────────┐      ┌──────────┐
│ User │─────▶│ OAuth Button │─────▶│  Google  │
└──────┘      └──────────────┘      │  GitHub  │
                                     └──────────┘
                                          │
                                          ▼
                              ┌───────────────────┐
                              │ User Authorizes   │
                              └───────────────────┘
                                          │
                                          ▼
                              ┌───────────────────┐
                              │ Callback with     │
                              │ Auth Code         │
                              └───────────────────┘
                                          │
                                          ▼
                              ┌───────────────────┐
                              │ /api/auth/callback│
                              └───────────────────┘
                                          │
                                          ▼
                              ┌───────────────────┐
                              │ Exchange Code for │
                              │ Session           │
                              └───────────────────┘
                                          │
                                          ▼
                              ┌───────────────────┐
                              │ Redirect /editor  │
                              └───────────────────┘
```

### 3. 세션 갱신

```
┌──────────────┐      ┌────────────┐      ┌──────────┐
│ Page Request │─────▶│ Middleware │─────▶│ Supabase │
└──────────────┘      └────────────┘      └──────────┘
                             │                   │
                             │                   ▼
                             │            ┌──────────┐
                             │            │ Validate │
                             │            │  Token   │
                             │            └──────────┘
                             │                   │
                             │                   ▼
                             │            ┌──────────┐
                             └───────────▶│  Refresh │
                                          │  If Exp  │
                                          └──────────┘
```

---

## 🎯 베스트 프랙티스

### 1. 클라이언트 선택

| 환경             | 클라이언트      | 용도               |
| ---------------- | --------------- | ------------------ |
| Client Component | `client.ts`     | OAuth, 실시간 구독 |
| Server Component | `server.ts`     | 데이터 페칭, RLS   |
| Server Action    | `server.ts`     | 데이터 변경        |
| Middleware       | `middleware.ts` | 라우트 보호        |

### 2. 에러 처리

```typescript
const result = await signIn(data);

if (!result.success) {
  // 사용자 친화적 에러 메시지
  showToast(result.error.message, "error");
  return;
}

// 성공 처리
router.push("/editor");
```

### 3. 로딩 상태

```typescript
const [isPending, startTransition] = useTransition();

startTransition(async () => {
  // Server Action 실행
  await signIn(data);
});

// UI에서 로딩 표시
{isPending && <Loader />}
```

### 4. 타입 안전성

```typescript
// 모든 인증 관련 타입 정의
export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  error?: AuthError;
}
```

---

## 🚀 성능 최적화

### 1. 메모이제이션

```typescript
export const UserProfile = React.memo(({ isCollapsed }) => {
  // 컴포넌트 로직
});
```

### 2. 지연 로딩

```typescript
const UserProfile = lazy(() => import("./UserProfile"));
```

### 3. 세션 캐싱

- Supabase가 자동으로 처리
- 브라우저 쿠키에 저장
- 서버에서 재사용

---

## 📊 모니터링

### Supabase Dashboard

1. **Users**: 가입자 수, 활성 사용자
2. **Auth Logs**: 로그인 시도, 에러
3. **Usage**: API 호출 수, 대역폭

### 권장 사항

- Sentry/DataDog 연동
- 로그인 실패율 모니터링
- 세션 만료 추적

---

## 🔧 트러블슈팅

### 문제: 무한 리다이렉트

**원인**: Middleware에서 잘못된 경로 매칭

**해결**:

```typescript
// 정적 파일 제외
matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"];
```

### 문제: "Invalid Refresh Token"

**원인**: 세션 만료

**해결**:

```typescript
// Middleware에서 자동 갱신
await supabase.auth.getUser(); // 세션 갱신
```

### 문제: RLS 정책 에러

**원인**: 잘못된 RLS 정책

**해결**:

```sql
-- 정책 확인
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

---

## 📚 참고 자료

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js 15 App Router](https://nextjs.org/docs/app)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [@supabase/ssr Package](https://github.com/supabase/auth-helpers)

---

## 🎓 학습 리소스

### 스타트업 인증 설계 패턴

1. **JWT vs Session**: Supabase는 JWT 기반
2. **Stateless Auth**: 서버 메모리 사용 최소화
3. **Refresh Token Rotation**: 보안 강화
4. **Social Login First**: 전환율 향상

### 확장 가능한 구조

- 마이크로서비스 지원
- API Gateway 통합 가능
- 다중 테넌트 지원
- Edge Computing 호환
