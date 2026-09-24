"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { authErrorToVi, GENERIC_ERROR_VI } from "@/lib/supabase/errors";

export type AuthFormState = {
  error?: string;
  notice?: string;
} | undefined;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isSameSitePath(path: FormDataEntryValue | null): path is string {
  return typeof path === "string" && path.startsWith("/") && !path.startsWith("//");
}

async function siteOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return host ? `${proto}://${host}` : "";
}

export async function signUpAction(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");
  const redirectTo = formData.get("redirect");
  const safeRedirect = isSameSitePath(redirectTo) ? redirectTo : "/tai-khoan";

  if (name.length < 2) return { error: "Vui lòng nhập họ và tên." };
  if (!EMAIL_RE.test(email)) return { error: "Vui lòng nhập email hợp lệ." };
  if (password.length < 6) return { error: "Mật khẩu cần ít nhất 6 ký tự." };
  if (password !== confirmPassword) return { error: "Xác nhận mật khẩu không khớp." };

  const supabase = await createClient();
  const origin = await siteOrigin();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
      emailRedirectTo: origin ? `${origin}${safeRedirect}` : undefined,
    },
  });

  if (error) return { error: authErrorToVi(error) };
  if (!data.session) {
    return { notice: "Vui lòng kiểm tra email để xác nhận tài khoản." };
  }

  redirect(safeRedirect);
}

export async function signInAction(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = formData.get("redirect");
  const safeRedirect = isSameSitePath(redirectTo) ? redirectTo : "/tai-khoan";

  if (!EMAIL_RE.test(email) || password.length === 0) {
    return { error: "Vui lòng nhập email và mật khẩu." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: authErrorToVi(error) };

  redirect(safeRedirect);
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function requestPasswordResetAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!EMAIL_RE.test(email)) return { error: "Vui lòng nhập email hợp lệ." };

  const supabase = await createClient();
  const origin = await siteOrigin();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: origin ? `${origin}/tai-khoan/dat-lai-mat-khau` : undefined,
  });

  // Supabase intentionally does not report whether the email exists. Show
  // the same success copy either way so this endpoint can't be used to
  // enumerate registered accounts — but a genuine transport/server error
  // (rate limit, outage) still gets its own message.
  if (error && error.status && error.status >= 500) {
    return { error: GENERIC_ERROR_VI };
  }

  return {
    notice: "Nếu email này có tài khoản, bạn sẽ nhận được email hướng dẫn đặt lại mật khẩu.",
  };
}
