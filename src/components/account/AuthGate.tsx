"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signInAction, signUpAction, type AuthFormState } from "@/lib/supabase/auth-actions";

const label = "block text-[10px] uppercase tracking-[.16em] text-charcoal/45";
const input =
  "mt-2 min-h-11 w-full border border-charcoal/15 bg-transparent px-4 text-sm text-charcoal outline-none focus:border-charcoal placeholder:text-charcoal/30";
const primaryButton =
  "flex min-h-11 w-full items-center justify-center bg-charcoal px-5 text-xs font-medium uppercase tracking-[.13em] text-cloud-milk transition-opacity hover:opacity-90 disabled:opacity-50";

function FormMessage({ state }: { state: AuthFormState }) {
  if (!state?.error && !state?.notice) return null;
  return (
    <p
      role="status"
      className={`border-l-2 pl-3 text-sm leading-relaxed ${
        state.error ? "border-peach text-charcoal" : "border-purple text-charcoal/75"
      }`}
    >
      {state.error ?? state.notice}
    </p>
  );
}

function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(signInAction, undefined);

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="redirect" value={redirectTo} />
      <div>
        <label className={label} htmlFor="login-email">
          Email
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={input}
        />
      </div>
      <div>
        <label className={label} htmlFor="login-password">
          Mật khẩu
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={input}
        />
      </div>
      <FormMessage state={state} />
      <button type="submit" disabled={pending} className={primaryButton}>
        {pending ? "ĐANG XỬ LÝ..." : "ĐĂNG NHẬP"}
      </button>
      <Link
        href="/tai-khoan/quen-mat-khau"
        className="text-center text-xs uppercase tracking-[.12em] text-charcoal/50 hover:text-charcoal"
      >
        QUÊN MẬT KHẨU?
      </Link>
    </form>
  );
}

function SignupForm({ redirectTo }: { redirectTo: string }) {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(signUpAction, undefined);

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="redirect" value={redirectTo} />
      <div>
        <label className={label} htmlFor="signup-name">
          Họ và tên
        </label>
        <input id="signup-name" name="name" type="text" autoComplete="name" required className={input} />
      </div>
      <div>
        <label className={label} htmlFor="signup-email">
          Email
        </label>
        <input
          id="signup-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={input}
        />
      </div>
      <div>
        <label className={label} htmlFor="signup-password">
          Mật khẩu
        </label>
        <input
          id="signup-password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={6}
          required
          className={input}
        />
      </div>
      <div>
        <label className={label} htmlFor="signup-confirm-password">
          Xác nhận mật khẩu
        </label>
        <input
          id="signup-confirm-password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          minLength={6}
          required
          className={input}
        />
      </div>
      <FormMessage state={state} />
      <button type="submit" disabled={pending} className={primaryButton}>
        {pending ? "ĐANG XỬ LÝ..." : "TẠO TÀI KHOẢN"}
      </button>
    </form>
  );
}

export function AuthGate({ redirectTo }: { redirectTo: string }) {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const tabButton = (active: boolean) =>
    `min-h-11 flex-1 border-b-2 text-xs font-medium uppercase tracking-[.13em] transition-colors ${
      active ? "border-charcoal text-charcoal" : "border-charcoal/10 text-charcoal/40"
    }`;

  return (
    <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-2">
      <div className="bg-lavender/35 p-[clamp(28px,5vw,64px)]">
        <div className="flex border-b border-charcoal/10">
          <button type="button" className={tabButton(tab === "login")} onClick={() => setTab("login")}>
            ĐĂNG NHẬP
          </button>
          <button type="button" className={tabButton(tab === "signup")} onClick={() => setTab("signup")}>
            ĐĂNG KÝ
          </button>
        </div>
        <div className="mt-8">
          {tab === "login" ? <LoginForm redirectTo={redirectTo} /> : <SignupForm redirectTo={redirectTo} />}
        </div>
        {tab === "login" ? (
          <p className="mt-6 text-center text-xs uppercase tracking-[.12em] text-charcoal/50">
            CHƯA CÓ TÀI KHOẢN?{" "}
            <button type="button" className="text-charcoal underline" onClick={() => setTab("signup")}>
              ĐĂNG KÝ
            </button>
          </p>
        ) : (
          <p className="mt-6 text-center text-xs uppercase tracking-[.12em] text-charcoal/50">
            ĐÃ CÓ TÀI KHOẢN?{" "}
            <button type="button" className="text-charcoal underline" onClick={() => setTab("login")}>
              ĐĂNG NHẬP
            </button>
          </p>
        )}
      </div>
      <div className="border border-charcoal/10 p-[clamp(28px,5vw,64px)]">
        <p className="text-[10px] uppercase tracking-[.18em] text-charcoal/45">Trong lúc chờ</p>
        <h2 className="mt-5 text-3xl font-medium uppercase tracking-[-.04em]">Danh sách yêu thích</h2>
        <p className="mt-4 leading-relaxed text-charcoal/60">
          Các sản phẩm đã lưu vẫn được giữ trên thiết bị này, kể cả trước khi bạn đăng nhập.
        </p>
        <Link
          href="/yeu-thich"
          className="mt-7 flex min-h-11 w-fit items-center border border-charcoal px-5 text-xs uppercase tracking-[.13em]"
        >
          Xem danh sách
        </Link>
      </div>
    </div>
  );
}
