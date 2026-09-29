"use client";

import { useActionState, useEffect } from "react";
import { createAddressAction, updateAddressAction, type AddressFormState } from "@/lib/supabase/address-actions";
import type { Address } from "@/lib/supabase/addresses";

const label = "block text-[11px] font-medium uppercase tracking-[.2em] text-charcoal/55";
const input =
  "mt-2 h-[52px] w-full rounded-2xl border border-charcoal/15 bg-white px-[18px] text-[15px] text-charcoal outline-none transition focus:border-purple focus:ring-4 focus:ring-purple/20 placeholder:text-charcoal/35";
const primaryButton =
  "flex h-[52px] w-fit items-center justify-center rounded-full bg-charcoal px-9 text-xs font-medium uppercase tracking-[.18em] text-cloud-milk transition duration-300 hover:-translate-y-0.5 hover:bg-purple hover:text-white disabled:opacity-50 disabled:hover:translate-y-0";
const secondaryButton =
  "flex h-[52px] w-fit items-center justify-center rounded-full border border-charcoal/25 px-8 text-xs font-medium uppercase tracking-[.18em] text-charcoal/70 transition-colors hover:border-charcoal hover:bg-charcoal hover:text-cloud-milk";

export function AddressForm({
  address,
  onCancel,
  onSaved,
}: {
  address?: Address;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const action = address ? updateAddressAction : createAddressAction;
  const [state, formAction, pending] = useActionState<AddressFormState, FormData>(action, undefined);

  useEffect(() => {
    if (state?.success) onSaved();
  }, [state?.success, onSaved]);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {address && <input type="hidden" name="id" value={address.id} />}

      <div>
        <h2 className="font-serif text-[clamp(1.6rem,3vw,2.1rem)] font-medium leading-tight text-charcoal">
          {address ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}
        </h2>
        <p className="mt-2 text-[13.5px] text-charcoal/55">Nhập thông tin nơi bạn muốn nhận hàng.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="addr-recipient">
            Họ tên người nhận
          </label>
          <input
            id="addr-recipient"
            name="recipientName"
            type="text"
            autoComplete="name"
            required
            defaultValue={address?.recipient_name}
            className={input}
          />
        </div>
        <div>
          <label className={label} htmlFor="addr-phone">
            Số điện thoại
          </label>
          <input
            id="addr-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            required
            defaultValue={address?.phone}
            className={input}
          />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="addr-line1">
          Địa chỉ chi tiết
        </label>
        <input
          id="addr-line1"
          name="addressLine1"
          type="text"
          autoComplete="address-line1"
          required
          placeholder="Số nhà, tên đường"
          defaultValue={address?.address_line_1}
          className={input}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div>
          <label className={label} htmlFor="addr-ward">
            Phường / Xã
          </label>
          <input
            id="addr-ward"
            name="ward"
            type="text"
            defaultValue={address?.ward ?? ""}
            className={input}
          />
        </div>
        <div>
          <label className={label} htmlFor="addr-district">
            Quận / Huyện
          </label>
          <input
            id="addr-district"
            name="district"
            type="text"
            defaultValue={address?.district ?? ""}
            className={input}
          />
        </div>
        <div>
          <label className={label} htmlFor="addr-province">
            Tỉnh / Thành phố
          </label>
          <input
            id="addr-province"
            name="province"
            type="text"
            autoComplete="address-level1"
            required
            defaultValue={address?.province}
            className={input}
          />
        </div>
      </div>

      <label className="flex min-h-[52px] cursor-pointer items-center gap-3 rounded-2xl border border-charcoal/10 bg-lavender/25 px-5 text-xs font-medium uppercase tracking-[.14em] text-charcoal/75">
        <input
          type="checkbox"
          name="isDefault"
          defaultChecked={address?.is_default}
          className="h-5 w-5 rounded border-charcoal/30 accent-purple"
        />
        Đặt làm địa chỉ mặc định
      </label>

      {state?.error && (
        <p className="rounded-xl border-l-2 border-peach bg-peach/10 px-3 py-2 text-sm leading-relaxed text-charcoal">
          {state.error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={pending} className={primaryButton}>
          {pending ? "ĐANG LƯU..." : "LƯU ĐỊA CHỈ"}
        </button>
        <button type="button" onClick={onCancel} className={secondaryButton}>
          HỦY
        </button>
      </div>
    </form>
  );
}
