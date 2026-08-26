"use client";

import { useId, useState, type FormEvent } from "react";

/**
 * Inline section only — no popup/modal, per CLAUDE.md > NEWSLETTER. No
 * email API exists yet, so submitting only flips local UI state to an
 * inline confirmation; it does not claim to send anything anywhere. Wire
 * this up to a real subscribe endpoint before launch.
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
    <section className="relative bg-cloud-milk py-[clamp(72px,10vh,144px)]">
      <div className="mx-auto flex max-w-[720px] flex-col items-center px-[clamp(20px,4vw,64px)] text-center">
        <h2 className="max-w-[22ch] text-[clamp(1.75rem,3.4vw,2.75rem)] font-medium leading-[1.15] tracking-[-0.01em] text-charcoal">
          MỘT CHÚT DOPAMINE TRONG HỘP THƯ CỦA BẠN.
        </h2>
        <p className="mt-4 max-w-[32rem] text-[clamp(0.95rem,1.3vw,1.0625rem)] text-charcoal/60">
          Nhận những câu chuyện, nghi thức và cập nhật mới từ Dopamind Mask Story.
        </p>

        {submitted ? (
          <p className="mt-8 text-sm font-medium text-purple" role="status">
            Cảm ơn bạn đã tham gia cùng Dopamind Mask Story.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex w-full max-w-[30rem] flex-col gap-3 sm:flex-row sm:gap-0"
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
              className="flex min-h-11 shrink-0 items-center justify-center bg-charcoal px-6 text-xs font-medium tracking-[0.14em] text-cloud-milk transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-purple"
            >
              THAM GIA CÙNG DOPAMIND MASK STORY
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
