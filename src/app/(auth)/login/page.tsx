"use client";

import { Loader2, Lock, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useTransition } from "react";

import { Button } from "@/components/common/Button";
import { InputField, InputLabel } from "@/components/common/Input";
import PageShell from "@/components/layout/PageShell";
import { useAuth } from "@/hooks/useAuth";
import { signIn } from "@/lib/actions/auth";
import { useToastStore } from "@/stores/toastStore";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirectTo");
  const redirectTo =
    rawRedirect && rawRedirect.startsWith("/") && !rawRedirect.startsWith("//")
      ? rawRedirect
      : "/editor";

  const { signInWithOAuth, refreshAuth } = useAuth();
  const { showError, showSuccess } = useToastStore();

  // 비밀번호 로그인 상태
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordPending, startPasswordTransition] = useTransition();

  // OAuth 상태
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  // 비밀번호 로그인
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      showError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    startPasswordTransition(async () => {
      const result = await signIn({ email, password });

      if (result.success) {
        showSuccess("로그인 성공!");

        // 클라이언트 측 인증 상태를 즉시 업데이트
        await refreshAuth();

        // 페이지 새로고침 및 리다이렉트
        router.refresh();
        router.push(redirectTo);
      } else {
        showError(result.error?.message || "로그인에 실패했습니다.");
      }
    });
  };

  // OAuth 로그인
  const handleOAuthLogin = async (provider: "google" | "github") => {
    setOauthLoading(provider);
    const result = await signInWithOAuth(provider);

    if (!result.success) {
      showError(result.error?.message || "소셜 로그인에 실패했습니다.");
      setOauthLoading(null);
    }
  };

  return (
    <PageShell
      title="로그인"
      className="min-h-screen dark:bg-gray-900 pb-12"
      contentClassName="max-w-md w-full space-y-8 mx-auto px-4"
    >
      {/* 로고 */}
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo_Bee_lsh_clear_gra.png"
            alt="HoneyPot"
            width={80}
            height={80}
            priority
          />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-pacifico">
          Waggle
        </h2>
      </div>

      {/* 비밀번호 로그인 (메인) */}
      <form onSubmit={handlePasswordLogin} className="mt-8 space-y-6">
        <div className="space-y-4">
          <div>
            <InputLabel htmlFor="email">이메일</InputLabel>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <InputField
                id="email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="your@email.com"
                className="pl-10"
                autoFocus
              />
            </div>
          </div>

          <div>
            <InputLabel htmlFor="password">비밀번호</InputLabel>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <InputField
                id="password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Link
              href="/reset-password"
              className="text-xs text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              비밀번호를 잊으셨나요?
            </Link>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={passwordPending}
          >
            {passwordPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                로그인 중...
              </>
            ) : (
              "로그인"
            )}
          </Button>
        </div>
      </form>

      {/* 구분선 */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gray-50 dark:bg-gray-900 text-gray-500">
            또는
          </span>
        </div>
      </div>

      {/* 소셜 로그인 */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => handleOAuthLogin("google")}
          disabled={!!oauthLoading}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {oauthLoading === "google" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          Google로 로그인
        </button>

        <button
          type="button"
          onClick={() => handleOAuthLogin("github")}
          disabled={!!oauthLoading}
          className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {oauthLoading === "github" ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
          )}
          GitHub로 로그인
        </button>
      </div>

      {/* 회원가입 링크 */}
      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        계정이 없으신가요?{" "}
        <Link
          href="/signup"
          className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
        >
          회원가입
        </Link>
      </p>
    </PageShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
