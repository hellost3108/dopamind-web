"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/lib/supabase/profile";

const label = "block text-[11px] font-medium uppercase tracking-[.2em] text-charcoal/55";
const input =
  "mt-2 h-[52px] w-full rounded-2xl border border-charcoal/15 bg-white px-[18px] text-[15px] text-charcoal outline-none transition focus:border-purple focus:ring-4 focus:ring-purple/20 placeholder:text-charcoal/35";
const disabledInput =
  "mt-2 h-[52px] w-full cursor-not-allowed rounded-2xl border border-charcoal/10 bg-white px-[18px] text-[15px] text-charcoal/55";
const primaryButton =
  "flex h-[52px] w-fit items-center justify-center rounded-full bg-charcoal px-9 text-xs font-medium uppercase tracking-[.18em] text-cloud-milk transition duration-300 hover:-translate-y-0.5 hover:bg-purple hover:text-white disabled:opacity-50 disabled:hover:translate-y-0";

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
    <form action={action} className="flex flex-col gap-6">
      <div>
        <label className={label} htmlFor="profile-email">
          Email
        </label>
        <input id="profile-email" type="email" value={email} disabled className={disabledInput} />
        <p className="mt-2 text-xs text-charcoal/55">Email đăng nhập không thể thay đổi.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
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
            placeholder="Ví dụ: 0901 234 567"
            className={input}
          />
        </div>
      </div>

      {state?.error && (
        <p className="border-l-2 border-peach pl-3 text-sm leading-relaxed text-charcoal">{state.error}</p>
      )}
      {state?.success && (
        <p className="border-l-2 border-mint pl-3 text-sm leading-relaxed text-charcoal">Đã lưu thay đổi.</p>
      )}

      <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:flex-col lg:items-start">
        <p className="text-[13px] text-charcoal/55">Thay đổi chỉ được lưu khi bạn bấm nút bên cạnh.</p>
        <button type="submit" disabled={pending} className={primaryButton}>
          {pending ? "ĐANG LƯU..." : "LƯU THAY ĐỔI"}
        </button>
      </div>
    </form>
  );
}
