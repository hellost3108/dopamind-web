"use client";

import { useId, useState, type FormEvent } from "react";

/**
 * Inline section only — no popup/modal. No email API exists yet, so
 * submitting only flips local UI state to an inline confirmation; it does
 * not claim to send anything anywhere. Wire this up to a real subscribe
 * endpoint before launch. Compact horizontal composition per CLAUDE.md >
 * NEWSLETTER (target desktop height ~150–220px).
 */
export function Newsletter() {
  const inputId = useId();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  }

  return (
    <section className="relative bg-cloud-milk py-[clamp(36px,4.5vw,56px)]">
      <div className="mx-auto max-w-[1600px] px-[clamp(20px,4vw,64px)]">
        <div className="flex flex-col gap-6 border-t border-charcoal/10 pt-[clamp(28px,3.4vw,44px)] xl:flex-row xl:items-center xl:justify-between xl:gap-10">
          <div className="max-w-[26rem]">
            <h2 className="font-serif text-[clamp(1.4rem,2vw,1.75rem)] font-medium leading-[1.2] tracking-[-0.01em] text-charcoal">
              Nhận một lời nhắc dịu dàng.
            </h2>
            <p className="mt-2 text-sm text-charcoal/60">
              Cập nhật những câu chuyện, nghi thức và điều mới từ DOPAMIND.
            </p>
          </div>

          {submitted ? (
            <p className="text-sm font-medium text-purple" role="status">
              Cảm ơn bạn đã tham gia cùng Dopamind Mask Story.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex w-full flex-col gap-3 sm:flex-row sm:gap-0 xl:w-auto xl:min-w-[26rem]"
            >
              <label htmlFor={inputId} className="sr-only">
                Email của bạn
              </label>
              <input
                id={inputId}
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email của bạn"
                className="min-h-11 w-full border border-charcoal/20 bg-cloud-milk px-4 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-charcoal/50 focus:outline-none sm:border-r-0"
              />
              <button
                type="submit"
                className="flex min-h-11 shrink-0 items-center justify-center bg-charcoal px-7 text-xs font-medium tracking-[0.14em] text-cloud-milk transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-purple"
              >
                ĐĂNG KÝ
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
