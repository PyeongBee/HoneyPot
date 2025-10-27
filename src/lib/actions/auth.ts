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

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        full_name: data.fullName,
      },
    },
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
    return {
      success: false,
      error: {
        message: error.message,
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

/**
 * 매직 링크로 로그인/회원가입
 * 비밀번호 없이 이메일만으로 인증
 */
export async function signInWithMagicLink(
  email: string
): Promise<AuthResponse> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      // 로그인 후 리다이렉트될 URL
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/editor`,
      // 계정이 없으면 자동 생성
      shouldCreateUser: true,
    },
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
