"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AddressForm } from "@/components/account/AddressForm";
import { deleteAddressAction, setDefaultAddressAction } from "@/lib/supabase/address-actions";
import type { Address } from "@/lib/supabase/addresses";

const pillButton =
  "inline-flex h-10 items-center justify-center rounded-full border border-charcoal/20 px-5 text-[11px] font-medium uppercase tracking-[.14em] text-charcoal transition-colors hover:border-charcoal hover:bg-charcoal hover:text-cloud-milk disabled:opacity-50";
const textButton =
  "inline-flex h-10 items-center justify-center rounded-full px-4 text-[11px] font-medium uppercase tracking-[.14em] text-charcoal/55 transition-colors hover:bg-lavender/40 hover:text-charcoal disabled:opacity-50";
const primaryButton =
  "inline-flex h-[52px] items-center justify-center rounded-full bg-charcoal px-9 text-xs font-medium uppercase tracking-[.18em] text-cloud-milk transition duration-300 hover:-translate-y-0.5 hover:bg-purple hover:text-white";

function formatAddressLine(address: Address): string {
  return [address.address_line_1, address.ward, address.district, address.province]
    .filter(Boolean)
    .join(", ");
}

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={22}
      height={22}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

function AddressCard({
  address,
  onEdit,
}: {
  address: Address;
  onEdit: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    if (!window.confirm("Xóa địa chỉ này?")) return;
    startTransition(async () => {
      const result = await deleteAddressAction(address.id);
      if (result.error) setError(result.error);
      else router.refresh();
    });
  }

  function handleSetDefault() {
    startTransition(async () => {
      const result = await setDefaultAddressAction(address.id);
      if (result.error) setError(result.error);
      else router.refresh();
    });
  }

  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-[26px] border bg-white p-7 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-26px_rgba(90,50,200,.45)] ${
        address.is_default ? "border-purple/50" : "border-charcoal/10"
      }`}
    >
      {address.is_default && (
        <span
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-lavender/60 blur-3xl"
        />
      )}

      <div className="relative flex items-start justify-between gap-3">
        <span
          className={`flex h-11 w-11 items-center justify-center rounded-full ${
            address.is_default ? "bg-purple text-white" : "bg-lavender/40 text-purple"
          }`}
        >
          <PinIcon />
        </span>
        {address.is_default && (
          <span className="rounded-full bg-mint px-3 py-1 text-[10px] font-medium uppercase tracking-[.14em] text-charcoal">
            Mặc định
          </span>
        )}
      </div>

      <div className="relative mt-5 flex-1">
        <p className="font-serif text-2xl font-medium leading-tight text-charcoal">{address.recipient_name}</p>
        <p className="mt-2 text-sm text-charcoal/65">{address.phone}</p>
        <p className="mt-1 text-sm leading-relaxed text-charcoal/65">{formatAddressLine(address)}</p>
      </div>

      {error && <p className="relative mt-4 border-l-2 border-peach pl-3 text-sm text-charcoal">{error}</p>}

      <div className="relative mt-6 flex flex-wrap items-center gap-2 border-t border-charcoal/10 pt-5">
        <button type="button" onClick={onEdit} className={pillButton}>
          SỬA
        </button>
        {!address.is_default && (
          <button type="button" disabled={pending} onClick={handleSetDefault} className={textButton}>
            ĐẶT LÀM MẶC ĐỊNH
          </button>
        )}
        <button type="button" disabled={pending} onClick={handleDelete} className={`${textButton} ml-auto`}>
          XÓA
        </button>
      </div>
    </div>
  );
}

const formWrap =
  "rounded-[26px] border border-charcoal/10 bg-white p-[clamp(24px,4vw,40px)] md:col-span-2";

export function AddressManager({ addresses }: { addresses: Address[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | "new" | null>(null);

  function handleSaved() {
    setEditingId(null);
    router.refresh();
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {addresses.length === 0 && editingId === null && (
        <div className="flex flex-col items-center rounded-[26px] border border-dashed border-charcoal/20 bg-white/70 px-6 py-16 text-center md:col-span-2">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-lavender/40 text-purple">
            <PinIcon />
          </span>
          <p className="mt-5 font-serif text-2xl text-charcoal">Chưa có địa chỉ nào.</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-charcoal/55">
            Bạn chưa lưu địa chỉ giao hàng nào.
          </p>
          <button type="button" onClick={() => setEditingId("new")} className={`${primaryButton} mt-7`}>
            + THÊM ĐỊA CHỈ MỚI
          </button>
        </div>
      )}

      {addresses.map((address) =>
        editingId === address.id ? (
          <div key={address.id} className={formWrap}>
            <AddressForm address={address} onCancel={() => setEditingId(null)} onSaved={handleSaved} />
          </div>
        ) : (
          <AddressCard key={address.id} address={address} onEdit={() => setEditingId(address.id)} />
        ),
      )}

      {editingId === "new" && (
        <div className={formWrap}>
          <AddressForm onCancel={() => setEditingId(null)} onSaved={handleSaved} />
        </div>
      )}

      {editingId !== "new" && addresses.length > 0 && (
        <button
          type="button"
          onClick={() => setEditingId("new")}
          className="group flex min-h-[220px] flex-col items-center justify-center gap-3 rounded-[26px] border border-dashed border-charcoal/25 bg-white/50 p-7 text-charcoal/60 transition duration-300 hover:border-purple hover:bg-lavender/30 hover:text-charcoal"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-current text-2xl leading-none transition-colors group-hover:bg-charcoal group-hover:text-cloud-milk">
            +
          </span>
          <span className="text-xs font-medium uppercase tracking-[.18em]">Thêm địa chỉ mới</span>
        </button>
      )}
    </div>
  );
}
