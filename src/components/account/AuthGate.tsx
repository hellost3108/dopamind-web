"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signInAction, signUpAction, type AuthFormState } from "@/lib/supabase/auth-actions";

const label = "block text-[10px] font-medium uppercase tracking-[.16em] text-charcoal/55";
const input =
  "mt-2 min-h-12 w-full rounded-xl border border-charcoal/15 bg-white px-4 text-sm font-medium text-charcoal outline-none transition-colors focus:border-purple focus:ring-2 focus:ring-purple/20 placeholder:font-normal placeholder:text-charcoal/30";
const primaryButton =
  "flex min-h-12 w-full items-center justify-center rounded-full bg-charcoal px-5 text-xs font-medium uppercase tracking-[.13em] text-cloud-milk transition-opacity hover:opacity-90 disabled:opacity-50";
const outlineButton =
  "flex min-h-12 w-full items-center justify-center rounded-full border border-charcoal/20 bg-white/60 px-5 text-xs font-medium uppercase tracking-[.13em] text-charcoal/70 transition-colors hover:border-charcoal hover:text-charcoal";

function FormMessage({ state }: { state: AuthFormState }) {
  if (!state?.error && !state?.notice) return null;
  return (
    <p
      role="status"
      className={`rounded-xl border-l-2 px-3 py-2 text-sm leading-relaxed ${
        state.error
          ? "border-peach bg-peach/10 text-charcoal"
          : "border-purple bg-purple/5 text-charcoal/75"
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
      <Link href="/tai-khoan/quen-mat-khau" className={outlineButton}>
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
      <div className="grid gap-5 sm:grid-cols-2">
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
    `min-h-11 flex-1 rounded-full text-xs font-medium uppercase tracking-[.13em] transition-colors ${
      active ? "bg-charcoal text-cloud-milk" : "text-charcoal/50 hover:text-charcoal"
    }`;

  return (
    <div className="mx-auto grid max-w-4xl items-stretch gap-5 lg:grid-cols-2 lg:gap-6">
      {/* Thẻ đăng nhập / đăng ký */}
      <div className="flex flex-col rounded-3xl bg-lavender/35 p-[clamp(24px,4vw,44px)]">
        <div className="flex gap-1 rounded-full bg-white/70 p-1">
          <button type="button" className={tabButton(tab === "login")} onClick={() => setTab("login")}>
            ĐĂNG NHẬP
          </button>
          <button type="button" className={tabButton(tab === "signup")} onClick={() => setTab("signup")}>
            ĐĂNG KÝ
          </button>
        </div>

        <div className="mt-7">
          {tab === "login" ? <LoginForm redirectTo={redirectTo} /> : <SignupForm redirectTo={redirectTo} />}
        </div>

        {tab === "login" ? (
          <p className="mt-6 text-center text-xs uppercase tracking-[.12em] text-charcoal/55">
            CHƯA CÓ TÀI KHOẢN?{" "}
            <button type="button" className="font-medium text-charcoal underline" onClick={() => setTab("signup")}>
              ĐĂNG KÝ
            </button>
          </p>
        ) : (
          <p className="mt-6 text-center text-xs uppercase tracking-[.12em] text-charcoal/55">
            ĐÃ CÓ TÀI KHOẢN?{" "}
            <button type="button" className="font-medium text-charcoal underline" onClick={() => setTab("login")}>
              ĐĂNG NHẬP
            </button>
          </p>
        )}
      </div>

      {/* Thẻ danh sách yêu thích */}
      <div className="flex flex-col items-center justify-center rounded-3xl border border-charcoal/10 bg-white/50 p-[clamp(24px,4vw,44px)] text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-purple/10 text-purple">
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z" />
          </svg>
        </span>
        <h2 className="mt-6 text-[clamp(1.5rem,2.6vw,2rem)] font-medium uppercase leading-[1.25] tracking-[-.02em] text-charcoal">
          Danh sách
          <br />
          yêu thích
        </h2>
        <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-charcoal/60">
          Các sản phẩm đã lưu vẫn được giữ trên thiết bị này, kể cả trước khi bạn đăng nhập.
        </p>
        <Link
          href="/yeu-thich"
          className="mt-7 flex min-h-11 w-fit items-center rounded-full border border-charcoal px-6 text-xs font-medium uppercase tracking-[.13em] text-charcoal transition-colors hover:bg-charcoal hover:text-cloud-milk"
        >
          Xem danh sách
        </Link>
      </div>
    </div>
  );
}
