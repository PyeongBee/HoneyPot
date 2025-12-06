import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

/**
 * OAuth 콜백 핸들러
 * Google, GitHub 등 소셜 로그인 후 리다이렉트 처리
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next");

  // 내부 경로만 허용 ('/' 시작, '//' 금지)
  const safeNext = rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//")
    ? rawNext
    : "/editor";

  // 신뢰 가능한 베이스 URL (배포 시 NEXT_PUBLIC_APP_URL 설정 권장)
  const base = process.env.NEXT_PUBLIC_APP_URL || origin;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${base}${safeNext}`);
    }
  }

  // 오류 시 내부 로그인 페이지로 고정 리다이렉트
  return NextResponse.redirect(`${base}/login?error=auth_callback_error`);
}

