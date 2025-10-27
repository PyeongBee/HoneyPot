# 🔐 인증 시스템 설정 가이드

HoneyPot 프로젝트의 Supabase 기반 인증 시스템 설정 방법을 안내합니다.

## 📋 목차

1. [Supabase 프로젝트 설정](#1-supabase-프로젝트-설정)
2. [환경 변수 설정](#2-환경-변수-설정)
3. [OAuth 프로바이더 설정](#3-oauth-프로바이더-설정)
4. [데이터베이스 설정](#4-데이터베이스-설정)
5. [로컬 개발](#5-로컬-개발)
6. [배포](#6-배포)

---

## 1. Supabase 프로젝트 설정

### 1.1 Supabase 계정 생성

1. [Supabase](https://supabase.com)에 접속
2. "Start your project" 클릭
3. GitHub 계정으로 로그인
4. 새 Organization 생성 (무료)

### 1.2 프로젝트 생성

1. "New Project" 클릭
2. 프로젝트 정보 입력:
   - **Name**: HoneyPot (또는 원하는 이름)
   - **Database Password**: 강력한 비밀번호 생성 (저장 필수!)
   - **Region**: Northeast Asia (Seoul)
   - **Pricing Plan**: Free
3. "Create new project" 클릭
4. 프로젝트 생성 완료 (약 2분 소요)

### 1.3 API 키 확인

1. 프로젝트 대시보드에서 **Settings** > **API** 이동
2. 다음 정보 복사:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

## 2. 환경 변수 설정

### 2.1 `.env.local` 파일 생성

프로젝트 루트에 `.env.local` 파일 생성:

```bash
cp .env.local.example .env.local
```

### 2.2 환경 변수 입력

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# 애플리케이션 URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

⚠️ **주의**: `.env.local` 파일은 Git에 커밋하지 마세요!

---

## 3. OAuth 프로바이더 설정

### 3.1 Google OAuth

#### Google Cloud Console 설정

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. **APIs & Services** > **OAuth consent screen** 이동
4. User Type: **External** 선택
5. 앱 정보 입력:
   - App name: HoneyPot
   - User support email: 본인 이메일
   - Developer contact: 본인 이메일
6. Scopes: `.../auth/userinfo.email`, `.../auth/userinfo.profile` 추가
7. Test users 추가 (개발 중)

#### OAuth 2.0 Client ID 생성

1. **APIs & Services** > **Credentials** 이동
2. **Create Credentials** > **OAuth client ID** 클릭
3. Application type: **Web application**
4. Name: HoneyPot
5. **Authorized redirect URIs** 추가:
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```
6. **Create** 클릭
7. Client ID와 Client Secret 복사

#### Supabase에 Google OAuth 설정

1. Supabase 대시보드 > **Authentication** > **Providers**
2. **Google** 찾기 > **Enable** 토글
3. 복사한 정보 입력:
   - **Client ID**: Google OAuth Client ID
   - **Client Secret**: Google OAuth Client Secret
4. **Save** 클릭

### 3.2 GitHub OAuth

#### GitHub OAuth App 생성

1. GitHub Settings > **Developer settings** > **OAuth Apps**
2. **New OAuth App** 클릭
3. 정보 입력:
   - Application name: HoneyPot
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL:
     ```
     https://your-project.supabase.co/auth/v1/callback
     ```
4. **Register application** 클릭
5. Client ID와 Client Secret 생성/복사

#### Supabase에 GitHub OAuth 설정

1. Supabase 대시보드 > **Authentication** > **Providers**
2. **GitHub** 찾기 > **Enable** 토글
3. 복사한 정보 입력:
   - **Client ID**: GitHub OAuth Client ID
   - **Client Secret**: GitHub OAuth Client Secret
4. **Save** 클릭

---

## 4. 데이터베이스 설정

### 4.1 사용자 프로필 테이블 생성 (선택)

Supabase SQL Editor에서 실행:

```sql
-- 사용자 프로필 테이블
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) 활성화
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 정책: 사용자는 자신의 프로필만 읽기 가능
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- 정책: 사용자는 자신의 프로필만 업데이트 가능
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- 트리거: auth.users에 새 사용자 생성 시 프로필 자동 생성
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

### 4.2 이메일 설정

1. Supabase 대시보드 > **Authentication** > **Email Templates**
2. 필요에 따라 이메일 템플릿 커스터마이징:
   - Confirm signup
   - Magic Link
   - Change Email Address
   - Reset Password

---

## 5. 로컬 개발

### 5.1 개발 서버 실행

```bash
npm run dev
```

### 5.2 테스트

1. http://localhost:3000/signup 접속
2. 회원가입 테스트
3. 이메일 확인 (개발 중에는 Supabase 대시보드에서 확인 가능)
4. http://localhost:3000/login 에서 로그인 테스트
5. OAuth 로그인 테스트

### 5.3 Supabase Auth 확인

1. Supabase 대시보드 > **Authentication** > **Users**
2. 생성된 사용자 확인

---

## 6. 배포

### 6.1 Vercel 배포

1. Vercel에 프로젝트 연결
2. **Environment Variables** 설정:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```
3. **Deploy** 클릭

### 6.2 OAuth Redirect URI 업데이트

배포 후 각 OAuth 프로바이더에 프로덕션 URL 추가:

**Google**:

- Authorized redirect URIs에 추가:
  ```
  https://your-project.supabase.co/auth/v1/callback
  ```

**GitHub**:

- Authorization callback URL에 추가:
  ```
  https://your-project.supabase.co/auth/v1/callback
  ```

---

## 🎉 완료!

이제 HoneyPot 프로젝트에서 완전한 인증 시스템을 사용할 수 있습니다.

### 주요 기능

- ✅ 이메일/비밀번호 로그인
- ✅ 소셜 로그인 (Google, GitHub)
- ✅ 비밀번호 재설정
- ✅ 보호된 라우트
- ✅ 세션 관리
- ✅ 사용자 프로필

### 다음 단계

- [ ] 사용자 프로필 페이지 구현
- [ ] 설정 페이지 구현
- [ ] 사용자별 데이터 관리 (RLS)
- [ ] 이메일 템플릿 커스터마이징

---

## 🆘 문제 해결

### 로그인이 안 돼요

1. `.env.local` 파일의 환경 변수 확인
2. Supabase 프로젝트가 활성화되어 있는지 확인
3. 브라우저 개발자 도구의 Console/Network 탭 확인

### OAuth가 작동하지 않아요

1. OAuth 프로바이더 설정 확인
2. Redirect URI가 정확한지 확인
3. Supabase 대시보드에서 Provider가 Enable 되어 있는지 확인

### 이메일이 오지 않아요

1. Supabase 대시보드 > Authentication > Users에서 이메일 상태 확인
2. 스팸 폴더 확인
3. 개발 중에는 Supabase Rate Limit 확인

---

## 📚 참고 자료

- [Supabase Auth 공식 문서](https://supabase.com/docs/guides/auth)
- [Next.js App Router Auth](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)
