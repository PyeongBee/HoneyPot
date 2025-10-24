This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 개발 환경 설정

이 프로젝트는 코드 품질과 일관성을 위해 ESLint, Prettier, TypeScript가 설정되어 있습니다.

### 필수 확장 프로그램 (VSCode/Cursor)

다음 확장 프로그램을 설치하세요:

- **ESLint** (`dbaeumer.vscode-eslint`) - JavaScript/TypeScript 린팅
- **Prettier** (`esbenp.prettier-vscode`) - 코드 포맷팅
- **Tailwind CSS IntelliSense** (`bradlc.vscode-tailwindcss`) - Tailwind CSS 자동완성

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
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

### 자동 포맷팅

- 파일 저장 시 자동으로 Prettier 포맷팅이 적용됩니다
- ESLint 오류는 자동으로 수정 가능한 것들이 수정됩니다
- Import 문은 자동으로 정렬됩니다

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
