"use client";

import { useActionState, useEffect } from "react";
import { createAddressAction, updateAddressAction, type AddressFormState } from "@/lib/supabase/address-actions";
import type { Address } from "@/lib/supabase/addresses";

const label = "block text-[10px] uppercase tracking-[.16em] text-charcoal/45";
const input =
  "mt-2 min-h-11 w-full border border-charcoal/15 bg-transparent px-4 text-sm text-charcoal outline-none focus:border-charcoal placeholder:text-charcoal/30";
const primaryButton =
  "flex min-h-11 w-fit items-center justify-center bg-charcoal px-6 text-xs font-medium uppercase tracking-[.13em] text-cloud-milk transition-opacity hover:opacity-90 disabled:opacity-50";
const secondaryButton =
  "flex min-h-11 w-fit items-center border border-charcoal/20 px-6 text-xs uppercase tracking-[.12em] text-charcoal/60 hover:border-charcoal hover:text-charcoal";

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
    <form action={formAction} className="flex flex-col gap-5 border border-charcoal/10 bg-cloud-milk p-6">
      {address && <input type="hidden" name="id" value={address.id} />}
      <div className="grid gap-5 sm:grid-cols-2">
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

      <div className="grid gap-5 sm:grid-cols-3">
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

      <label className="flex min-h-11 items-center gap-3 text-xs uppercase tracking-[.12em] text-charcoal/70">
        <input
          type="checkbox"
          name="isDefault"
          defaultChecked={address?.is_default}
          className="h-5 w-5 border-charcoal/30"
        />
        Đặt làm địa chỉ mặc định
      </label>

      {state?.error && (
        <p className="border-l-2 border-peach pl-3 text-sm leading-relaxed text-charcoal">{state.error}</p>
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
