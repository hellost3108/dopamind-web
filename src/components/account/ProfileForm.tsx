"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/lib/supabase/profile";

const label = "block text-[10px] uppercase tracking-[.16em] text-charcoal/45";
const input =
  "mt-2 min-h-11 w-full border border-charcoal/15 bg-transparent px-4 text-sm text-charcoal outline-none focus:border-charcoal placeholder:text-charcoal/30";
const disabledInput =
  "mt-2 min-h-11 w-full border border-charcoal/10 bg-charcoal/[.03] px-4 text-sm text-charcoal/50";
const primaryButton =
  "flex min-h-11 w-fit items-center justify-center bg-charcoal px-6 text-xs font-medium uppercase tracking-[.13em] text-cloud-milk transition-opacity hover:opacity-90 disabled:opacity-50";

export function ProfileForm({
  email,
  fullName,
  phone,
}: {
  email: string;
  fullName: string;
  phone: string;
}) {
  const [state, action, pending] = useActionState(updateProfileAction, undefined);

  return (
    <form action={action} className="flex max-w-lg flex-col gap-5">
      <div>
        <label className={label} htmlFor="profile-email">
          Email
        </label>
        <input id="profile-email" type="email" value={email} disabled className={disabledInput} />
      </div>
      <div>
        <label className={label} htmlFor="profile-full-name">
          Họ và tên
        </label>
        <input
          id="profile-full-name"
          name="fullName"
          type="text"
          autoComplete="name"
          required
          defaultValue={fullName}
          className={input}
        />
      </div>
      <div>
        <label className={label} htmlFor="profile-phone">
          Số điện thoại
        </label>
        <input
          id="profile-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          defaultValue={phone}
          className={input}
        />
      </div>
      {state?.error && (
        <p className="border-l-2 border-peach pl-3 text-sm leading-relaxed text-charcoal">{state.error}</p>
      )}
      {state?.success && (
        <p className="border-l-2 border-mint pl-3 text-sm leading-relaxed text-charcoal">Đã lưu thay đổi.</p>
      )}
      <button type="submit" disabled={pending} className={primaryButton}>
        {pending ? "ĐANG LƯU..." : "LƯU THAY ĐỔI"}
      </button>
    </form>
  );
}
