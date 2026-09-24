"use client";

import { useActionState } from "react";
import { requestPasswordResetAction } from "@/lib/supabase/auth-actions";

const label = "block text-[10px] uppercase tracking-[.16em] text-charcoal/45";
const input =
  "mt-2 min-h-11 w-full border border-charcoal/15 bg-transparent px-4 text-sm text-charcoal outline-none focus:border-charcoal placeholder:text-charcoal/30";
const primaryButton =
  "flex min-h-11 w-full items-center justify-center bg-charcoal px-5 text-xs font-medium uppercase tracking-[.13em] text-cloud-milk transition-opacity hover:opacity-90 disabled:opacity-50";

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState(requestPasswordResetAction, undefined);

  if (state?.notice) {
    return <p className="border-l-2 border-purple pl-3 text-sm leading-relaxed text-charcoal/75">{state.notice}</p>;
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      <div>
        <label className={label} htmlFor="forgot-email">
          Email
        </label>
        <input id="forgot-email" name="email" type="email" autoComplete="email" required className={input} />
      </div>
      {state?.error && (
        <p className="border-l-2 border-peach pl-3 text-sm leading-relaxed text-charcoal">{state.error}</p>
      )}
      <button type="submit" disabled={pending} className={primaryButton}>
        {pending ? "ĐANG GỬI..." : "GỬI YÊU CẦU"}
      </button>
    </form>
  );
}
