import { updateSession } from "@/lib/supabase/middleware";
import { type NextRequest } from "next/server";

/**
 * 미들웨어: 모든 요청에 대해 세션을 확인하고 갱신합니다.
 * 인증이 필요한 페이지는 자동으로 보호됩니다.
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * 다음 경로를 제외한 모든 요청 매칭:
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화)
     * - favicon.ico (파비콘)
     * - public 폴더의 이미지들
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
