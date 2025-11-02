"use client";

import { Button } from "@/components/common/Button";
import { InputField, InputLabel } from "@/components/common/Input";
import { resetPassword, signOut, updatePassword } from "@/lib/actions/auth";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";
import { ArrowLeft, Loader2, Lock, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, useTransition } from "react";

function ResetPasswordForm() {
  const { showError, showSuccess } = useToastStore();
  const { reset } = useAuthStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPending, startTransition] = useTransition();
  const [emailSent, setEmailSent] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);

  // URL에 토큰이 있는지 확인 (이메일 링크를 통해 온 경우)
  useEffect(() => {
    // Supabase는 비밀번호 재설정 시 URL에 code 파라미터를 보냄
    const code = searchParams.get("code");

    // URL hash도 확인 (이전 방식 호환)
    const hash = window.location.hash;
    const hasHashToken =
      hash.includes("access_token") || hash.includes("type=recovery");

    // code가 있거나 hash에 토큰이 있으면 비밀번호 재설정 모드
    const hasToken = !!code || hasHashToken;

    setIsResetMode(hasToken);
  }, [searchParams]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      showError("이메일을 입력해주세요.");
      return;
    }

    startTransition(async () => {
      const result = await resetPassword(email);

      if (result.success) {
        setEmailSent(true);
        showSuccess("비밀번호 재설정 이메일을 전송했습니다.");
      } else {
        showError(result.error?.message || "이메일 전송에 실패했습니다.");
      }
    });
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword) {
      showError("새 비밀번호를 입력해주세요.");
      return;
    }

    if (newPassword.length < 6) {
      showError("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    if (newPassword !== confirmPassword) {
      showError("비밀번호가 일치하지 않습니다.");
      return;
    }

    startTransition(async () => {
      const result = await updatePassword(newPassword);

      if (result.success) {
        // authStore 상태 초기화 (먼저 수행)
        reset();

        // 토스트 표시 (reset 후에 표시)
        showSuccess("비밀번호가 변경되었습니다. 새 비밀번호로 로그인해주세요.");

        // 토스트가 보일 시간을 주고 세션 로그아웃 처리
        setTimeout(async () => {
          try {
            await signOut();
          } catch (error) {
            // signOut의 redirect를 무시하고 직접 로그인 페이지로 이동
            router.push("/login");
          }
        }, 500);
      } else {
        showError(result.error?.message || "비밀번호 변경에 실패했습니다.");
      }
    });
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
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              이메일을 확인하세요
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {email}로 비밀번호 재설정 링크를 보냈습니다.
              <br />
              이메일을 확인하고 링크를 클릭해주세요.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              로그인 페이지로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 새 비밀번호 입력 화면 (이메일 링크를 통해 온 경우)
  if (isResetMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
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
              새 비밀번호 설정
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              새로운 비밀번호를 입력해주세요
            </p>
          </div>

          {/* 폼 */}
          <form onSubmit={handlePasswordSubmit} className="mt-8 space-y-6">
            <div>
              <InputLabel htmlFor="newPassword">새 비밀번호</InputLabel>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <InputField
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={setNewPassword}
                  placeholder="새 비밀번호 (최소 6자)"
                  className="pl-10"
                  autoFocus
                />
              </div>
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
                  placeholder="비밀번호 확인"
                  className="pl-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  변경 중...
                </>
              ) : (
                "비밀번호 변경"
              )}
            </Button>

            <div className="text-center">
              <Link
                href="/login"
                className="inline-flex items-center text-sm text-gray-600 hover:text-gray-500 dark:text-gray-400"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                로그인 페이지로 돌아가기
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // 이메일 입력 화면 (처음 접속한 경우)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
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
            비밀번호 재설정
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            가입 시 사용한 이메일을 입력하세요
          </p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleEmailSubmit} className="mt-8 space-y-6">
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

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                전송 중...
              </>
            ) : (
              "재설정 링크 받기"
            )}
          </Button>

          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-500 dark:text-gray-400"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              로그인 페이지로 돌아가기
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
