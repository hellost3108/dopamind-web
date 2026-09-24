"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { AddressForm } from "@/components/account/AddressForm";
import { deleteAddressAction, setDefaultAddressAction } from "@/lib/supabase/address-actions";
import type { Address } from "@/lib/supabase/addresses";

const primaryButton =
  "flex min-h-11 w-fit items-center justify-center bg-charcoal px-6 text-xs font-medium uppercase tracking-[.13em] text-cloud-milk transition-opacity hover:opacity-90";
const ghostButton =
  "flex min-h-11 items-center px-3 text-xs uppercase tracking-[.1em] text-charcoal/50 transition-colors hover:text-charcoal";

function formatAddressLine(address: Address): string {
  return [address.address_line_1, address.ward, address.district, address.province]
    .filter(Boolean)
    .join(", ");
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
    <div className="border border-charcoal/10 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <p className="text-sm font-medium text-charcoal">{address.recipient_name}</p>
            {address.is_default && (
              <span className="bg-purple/15 px-2 py-1 text-[10px] uppercase tracking-[.1em] text-purple">
                Mặc định
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-charcoal/60">{address.phone}</p>
          <p className="mt-1 max-w-md text-sm leading-relaxed text-charcoal/60">
            {formatAddressLine(address)}
          </p>
        </div>
      </div>
      {error && <p className="mt-3 border-l-2 border-peach pl-3 text-sm text-charcoal">{error}</p>}
      <div className="mt-4 flex flex-wrap gap-1 border-t border-charcoal/10 pt-3">
        <button type="button" onClick={onEdit} className={ghostButton}>
          SỬA
        </button>
        {!address.is_default && (
          <button type="button" disabled={pending} onClick={handleSetDefault} className={ghostButton}>
            ĐẶT LÀM MẶC ĐỊNH
          </button>
        )}
        <button type="button" disabled={pending} onClick={handleDelete} className={ghostButton}>
          XÓA
        </button>
      </div>
    </div>
  );
}

export function AddressManager({ addresses }: { addresses: Address[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | "new" | null>(null);

  function handleSaved() {
    setEditingId(null);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      {addresses.length === 0 && editingId === null && (
        <p className="text-sm leading-relaxed text-charcoal/55">
          Bạn chưa lưu địa chỉ giao hàng nào.
        </p>
      )}

      {addresses.map((address) =>
        editingId === address.id ? (
          <AddressForm
            key={address.id}
            address={address}
            onCancel={() => setEditingId(null)}
            onSaved={handleSaved}
          />
        ) : (
          <AddressCard key={address.id} address={address} onEdit={() => setEditingId(address.id)} />
        ),
      )}

      {editingId === "new" ? (
        <AddressForm onCancel={() => setEditingId(null)} onSaved={handleSaved} />
      ) : (
        <button type="button" onClick={() => setEditingId("new")} className={primaryButton}>
          + THÊM ĐỊA CHỈ MỚI
        </button>
      )}
    </div>
  );
}
