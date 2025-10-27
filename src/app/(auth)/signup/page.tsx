"use client";

import { Button } from "@/components/common/Button";
import { InputField, InputLabel } from "@/components/common/Input";
import { useAuth } from "@/hooks/useAuth";
import { signInWithMagicLink, signUp } from "@/lib/actions/auth";
import { useToastStore } from "@/stores/toastStore";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  Lock,
  Mail,
  Sparkles,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const { signInWithOAuth } = useAuth();
  const { showError, showSuccess } = useToastStore();

  // 매직 링크 상태
  const [magicEmail, setMagicEmail] = useState("");
  const [magicPending, startMagicTransition] = useTransition();
  const [emailSent, setEmailSent] = useState(false);

  // 비밀번호 회원가입 상태
  const [showPasswordSignup, setShowPasswordSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [passwordPending, startPasswordTransition] = useTransition();

  // OAuth 상태
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  // 매직 링크로 가입
  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!magicEmail) {
      showError("이메일을 입력해주세요.");
      return;
    }

    startMagicTransition(async () => {
      const result = await signInWithMagicLink(magicEmail);

      if (result.success) {
        setEmailSent(true);
        showSuccess("✨ 매직 링크를 이메일로 전송했습니다!");
      } else {
        showError(result.error?.message || "전송에 실패했습니다.");
      }
    });
  };

  // 비밀번호로 회원가입
  const handlePasswordSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!email || !password || !confirmPassword) {
      showError("모든 필드를 입력해주세요.");
      return;
    }

    if (password.length < 6) {
      showError("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    if (password !== confirmPassword) {
      showError("비밀번호가 일치하지 않습니다.");
      return;
    }

    startPasswordTransition(async () => {
      const result = await signUp({ email, password, fullName });

      if (result.success) {
        showSuccess("회원가입 성공! 이메일을 확인해주세요.");
        router.push("/login");
      } else {
        showError(result.error?.message || "회원가입에 실패했습니다.");
      }
    });
  };

  // OAuth 가입
  const handleOAuthSignUp = async (provider: "google" | "github") => {
    setOauthLoading(provider);
    const result = await signInWithOAuth(provider);

    if (!result.success) {
      showError(result.error?.message || "소셜 가입에 실패했습니다.");
      setOauthLoading(null);
    }
  };

  // 이메일 전송 완료 화면
  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo_Bee_lsh_clear_gra.png"
              alt="HoneyPot"
              width={80}
              height={80}
              priority
            />
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              이메일을 확인하세요 ✨
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              <strong>{magicEmail}</strong>로
              <br />
              매직 링크를 보냈습니다.
              <br />
              <br />
              이메일의 링크를 클릭하면
              <br />
              자동으로 가입 및 로그인됩니다!
            </p>

            <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
              <p>💡 링크는 5분간 유효합니다</p>
              <p>📧 이메일이 안 보이나요? 스팸 폴더를 확인해보세요</p>
            </div>
          </div>

          <button
            onClick={() => setEmailSent(false)}
            className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            다시 보내기
          </button>
        </div>
      </div>
    );
  }

  // 회원가입 페이지
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
      <div className="max-w-md w-full space-y-8">
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
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            회원가입 🎉
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            평비의 꿀단지에 오신 것을 환영합니다
          </p>
        </div>

        {/* 매직 링크 가입 (메인) */}
        <form onSubmit={handleMagicLink} className="mt-8 space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-lg border-2 border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                매직 링크로 간편하게
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <InputLabel htmlFor="magic-email">이메일</InputLabel>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <InputField
                    id="magic-email"
                    type="email"
                    value={magicEmail}
                    onChange={setMagicEmail}
                    placeholder="your@email.com"
                    className="pl-10"
                    autoFocus
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={magicPending}
              >
                {magicPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    전송 중...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    매직 링크로 시작하기
                  </>
                )}
              </Button>
            </div>

            <p className="mt-3 text-xs text-gray-600 dark:text-gray-400 text-center">
              비밀번호 설정 없이 이메일만으로 가입 • 클릭 한 번으로 완료
            </p>
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

        {/* 소셜 가입 */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => handleOAuthSignUp("google")}
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
            Google로 가입
          </button>

          <button
            type="button"
            onClick={() => handleOAuthSignUp("github")}
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
            GitHub로 가입
          </button>
        </div>

        {/* 비밀번호로 회원가입 (접기 가능) */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
          <button
            type="button"
            onClick={() => setShowPasswordSignup(!showPasswordSignup)}
            className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>비밀번호로 회원가입</span>
            </div>
            {showPasswordSignup ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {showPasswordSignup && (
            <form
              onSubmit={handlePasswordSignup}
              className="px-4 pb-4 space-y-4"
            >
              <div>
                <InputLabel htmlFor="fullName">이름 (선택)</InputLabel>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <InputField
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={setFullName}
                    placeholder="홍길동"
                    className="pl-10"
                  />
                </div>
              </div>

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
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  최소 6자 이상
                </p>
              </div>

              <div>
                <InputLabel htmlFor="confirmPassword">비밀번호 확인</InputLabel>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <InputField
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    placeholder="••••••••"
                    className="pl-10"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="secondary"
                size="lg"
                className="w-full"
                disabled={passwordPending}
              >
                {passwordPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    가입 중...
                  </>
                ) : (
                  "회원가입"
                )}
              </Button>
            </form>
          )}
        </div>

        {/* 로그인 링크 */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          이미 계정이 있으신가요?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
}
