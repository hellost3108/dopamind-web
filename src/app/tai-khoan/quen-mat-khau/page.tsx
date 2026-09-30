import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ForgotPasswordForm } from "@/components/account/ForgotPasswordForm";
import { SHOW_FORGOT_PASSWORD } from "@/lib/feature-flags";

export const metadata: Metadata = { title: "Quên mật khẩu | DOPAMIND" };

export default function ForgotPasswordPage() {
  // Tính năng đang tắt: hiện trang 404. Bật lại trong src/lib/feature-flags.ts
  if (!SHOW_FORGOT_PASSWORD) notFound();

  return (
    <>
      {/* Tiêu đề */}
      <section className="relative overflow-hidden border-b border-charcoal/10 px-[clamp(20px,4vw,64px)] pb-[clamp(40px,5vw,72px)] pt-[clamp(48px,6vw,88px)]">
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-72 w-[42rem] max-w-full -translate-x-1/2 rounded-full bg-lavender/40 blur-3xl"
        />
        <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
          <div className="flex items-center gap-4">
            <span aria-hidden className="h-px w-10 bg-charcoal/25" />
            <p className="text-[10px] font-medium uppercase tracking-[.32em] text-charcoal/55">
              Tài khoản DOPAMIND
            </p>
            <span aria-hidden className="h-px w-10 bg-charcoal/25" />
          </div>
          <h1 className="mt-8 font-serif text-[clamp(2.25rem,5vw,4rem)] font-light leading-[1.15] tracking-[-.01em] text-charcoal">
            Quên
            <br />
            <span className="text-purple">mật khẩu.</span>
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-charcoal/60">
            Nhập email của bạn, chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="px-[clamp(20px,4vw,64px)] py-[clamp(40px,6vw,88px)]">
        <div className="mx-auto max-w-md rounded-3xl bg-lavender/35 p-[clamp(24px,4vw,44px)]">
          <ForgotPasswordForm />
          <Link
            href="/tai-khoan"
            className="mt-5 flex min-h-12 w-full items-center justify-center rounded-full border border-charcoal/20 bg-white/60 px-5 text-xs font-medium uppercase tracking-[.13em] text-charcoal/70 transition-colors hover:border-charcoal hover:text-charcoal"
          >
            QUAY LẠI ĐĂNG NHẬP
          </Link>
        </div>
      </section>
    </>
  );
}
