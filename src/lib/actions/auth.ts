"use server";

import { createClient } from "@/lib/supabase/server";
import { AuthResponse, SignInData, SignUpData } from "@/types/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Server Actions for Authentication
 * 서버에서 실행되는 인증 관련 액션들
 */

export async function signUp(data: SignUpData): Promise<AuthResponse> {
  const supabase = await createClient();

  const { data: signUpData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName,
      },
    },
  });

  if (error) {
    // 에러 메시지를 한국어로 변환
    let message = error.message;

    if (
      error.message.includes("already registered") ||
      error.message.includes("User already registered")
    ) {
      message = "이미 가입된 이메일입니다. 로그인해주세요.";
    } else if (error.message.includes("Invalid email")) {
      message = "유효하지 않은 이메일 주소입니다.";
    } else if (error.message.includes("Password")) {
      message = "비밀번호는 최소 6자 이상이어야 합니다.";
    }

    return {
      success: false,
      error: {
        message,
        code: error.code,
      },
    };
  }

  // Supabase는 이메일 확인이 비활성화된 경우에도 중복 가입을 허용할 수 있음
  // identities 배열이 비어있으면 이미 가입된 사용자
  if (
    signUpData.user &&
    signUpData.user.identities &&
    signUpData.user.identities.length === 0
  ) {
    return {
      success: false,
      error: {
        message: "이미 가입된 이메일입니다. 로그인해주세요.",
        code: "user_already_exists",
      },
    };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function signIn(data: SignInData): Promise<AuthResponse> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    // 에러 메시지를 한국어로 변환
    let message = error.message;

    if (
      error.message.includes("Invalid login credentials") ||
      error.message.includes("Invalid credentials")
    ) {
      message = "이메일 또는 비밀번호가 올바르지 않습니다.";
    } else if (error.message.includes("Email not confirmed")) {
      message = "이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요.";
    } else if (error.message.includes("Invalid email")) {
      message = "유효하지 않은 이메일 주소입니다.";
    }

    return {
      success: false,
      error: {
        message,
        code: error.code,
      },
    };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function resetPassword(email: string): Promise<AuthResponse> {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
  });

  if (error) {
    // 에러 메시지를 한국어로 변환
    let message = error.message;

    if (error.message.includes("Invalid email")) {
      message = "유효하지 않은 이메일 주소입니다.";
    } else if (error.message.includes("not found")) {
      message = "등록되지 않은 이메일 주소입니다.";
    }

    return {
      success: false,
      error: {
        message,
        code: error.code,
      },
    };
  }

  return { success: true };
}

export async function updatePassword(
  newPassword: string
): Promise<AuthResponse> {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
      },
    };
  }

  return { success: true };
}

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
