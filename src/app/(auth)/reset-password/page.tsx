"use client";

import { Button } from "@/components/common/Button";
import { InputField, InputLabel } from "@/components/common/Input";
import { resetPassword } from "@/lib/actions/auth";
import { useToastStore } from "@/stores/toastStore";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";

export default function ResetPasswordPage() {
  const { showError, showSuccess } = useToastStore();

  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
