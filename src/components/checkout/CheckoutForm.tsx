"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { placeOrder } from "@/app/thanh-toan/actions";
import { SHIPPING_FEE } from "@/lib/checkout";
import { AddressForm } from "@/components/account/AddressForm";
import { ProductImage } from "@/components/product/ProductImage";
import type { Tables } from "@/lib/supabase/database.types";

type Address = Tables<"addresses">;
type AddressMode = "summary" | "picker" | "form";

function formatVnd(amount: number): string {
  return amount.toLocaleString("vi-VN") + "đ";
}

function LockIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="4" y="10" width="16" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="1" y="6" width="13" height="11" rx="1.5" />
      <path d="M14 10h4l3 3v4h-7z" />
      <circle cx="6" cy="19" r="1.7" />
      <circle cx="17.5" cy="19" r="1.7" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 8l-9-5-9 5 9 5 9-5z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="M12 13v8" />
    </svg>
  );
}

function ProgressSteps({ current }: { current: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: "GIỎ HÀNG" },
    { n: 2, label: "THANH TOÁN" },
    { n: 3, label: "HOÀN TẤT" },
  ] as const;

  return (
    <div className="mb-10 flex items-center">
      {steps.map((step, i) => (
        <div key={step.n} className="flex flex-1 items-center last:flex-none">
          <div className="flex flex-col items-center gap-2">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                step.n < current
                  ? "bg-purple text-cloud-milk"
                  : step.n === current
                  ? "bg-charcoal text-cloud-milk"
                  : "bg-charcoal/10 text-charcoal/40"
              }`}
            >
              {step.n < current ? (
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : (
                step.n
              )}
            </span>
            <span className={`text-[9px] uppercase tracking-[.1em] ${step.n === current ? "text-charcoal" : "text-charcoal/40"}`}>
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <span className={`mx-2 h-px flex-1 ${step.n < current ? "bg-purple" : "bg-charcoal/10"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function ShippingMethodCard() {
  return (
    <div className="mb-6 flex items-center gap-3 rounded-xl border border-purple/30 bg-lavender/10 p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple/15 text-purple">
        <TruckIcon />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-charcoal">Giao hàng tiêu chuẩn</p>
        <p className="text-xs font-medium text-charcoal/60">Nhân viên giao hàng sẽ liên hệ trước khi giao.</p>
      </div>
      <span className="shrink-0 text-sm font-medium text-purple">{formatVnd(SHIPPING_FEE)}</span>
    </div>
  );
}

function AddressSummaryCard({
  address,
  onChangeClick,
}: {
  address: Address;
  onChangeClick: () => void;
}) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-purple/40 bg-lavender/10 p-4">
      <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple/15 text-purple">
        <TruckIcon />
      </span>
      <div className="min-w-0 flex-1 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-charcoal">{address.recipient_name}</span>
          {address.is_default && (
            <span className="rounded-full bg-purple/10 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[.08em] text-purple">
              Mặc định
            </span>
          )}
        </div>
        <p className="mt-0.5 font-medium text-charcoal/65">{address.phone}</p>
        <p className="mt-1 leading-relaxed text-charcoal/70">
          {address.address_line_1}
          {address.address_line_2 ? `, ${address.address_line_2}` : ""}, {address.ward}, {address.district},{" "}
          {address.province}
        </p>
      </div>
      <button
        type="button"
        onClick={onChangeClick}
        className="shrink-0 text-xs font-medium uppercase tracking-[.1em] text-purple hover:text-charcoal"
      >
        Đổi
      </button>
    </div>
  );
}

export function CheckoutForm({ addresses }: { addresses: Address[] }) {
  const router = useRouter();
  const { lines, subtotal, clear } = useCart();

  const initialAddress = addresses.find((a) => a.is_default) ?? addresses[0] ?? null;

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    initialAddress?.id ?? null
  );
  const [addressMode, setAddressMode] = useState<AddressMode>(
    initialAddress ? "summary" : "form"
  );

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bank_transfer">("cod");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const pendingSelectNewestRef = useRef(false);

  useEffect(() => {
    if (!pendingSelectNewestRef.current) return;
    const newest = addresses.find((a) => a.is_default) ?? addresses[addresses.length - 1];
    if (newest) {
      setSelectedAddressId(newest.id);
      setAddressMode("summary");
    }
    pendingSelectNewestRef.current = false;
  }, [addresses]);

  function handleAddressSaved() {
    pendingSelectNewestRef.current = true;
    router.refresh();
  }

  function handleFormCancel() {
    setAddressMode(addresses.length > 0 ? "picker" : "form");
  }

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) ?? null;

  const total = subtotal + SHIPPING_FEE;

  const items = useMemo(
    () => lines.map((l) => ({ variant_id: l.variantId, quantity: l.quantity })),
    [lines]
  );

  function handleSubmit() {
    setError(null);
    if (lines.length === 0) {
      setError("Giỏ hàng đang trống.");
      return;
    }
    if (!selectedAddressId) {
      setError("Vui lòng chọn hoặc nhập địa chỉ giao hàng.");
      return;
    }

    const formData = new FormData();
    formData.set("addressId", selectedAddressId);
    formData.set("paymentMethod", paymentMethod);
    formData.set("items", JSON.stringify(items));
    formData.set("customerNote", note);

        startTransition(async () => {
      const result = await placeOrder({}, formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      if (result?.orderNumber) {
        clear();
        router.push(`/thanh-toan/thanh-cong?order=${result.orderNumber}`);
      }
    });
  }

  if (lines.length === 0) {
    return (
      <div className="rounded-2xl border border-charcoal/15 bg-white/60 p-10 text-center">
        <p className="mb-6 text-sm font-medium text-charcoal/70">Giỏ hàng của bạn đang trống.</p>
        <Link
          href="/san-pham"
          className="inline-flex min-h-11 items-center rounded-full bg-charcoal px-6 text-xs uppercase tracking-[.13em] text-cloud-milk"
        >
          XEM SẢN PHẨM
        </Link>
      </div>
    );
  }

  return (
    <div>
      <ProgressSteps current={2} />

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-14">
        {/* CỘT TRÁI */}
        <div className="space-y-8">
          {/* Địa chỉ giao hàng */}
          <section className="rounded-2xl border border-charcoal/10 bg-white/70 p-6 sm:p-8">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[.16em] text-purple">
                  Thông tin người nhận
                </p>
                <h2 className="mt-2 font-serif text-[clamp(1.35rem,3vw,1.75rem)] leading-[1.15] text-charcoal">
                  Đơn hàng sẽ được giao đến đâu?
                </h2>
              </div>
              <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-lavender/30 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[.08em] text-purple">
                <LockIcon />
                Bảo mật thông tin
              </span>
            </div>

            <ShippingMethodCard />

            {/* Chế độ 1: đã chọn 1 địa chỉ — chỉ hiện tóm tắt */}
            {addressMode === "summary" && selectedAddress && (
              <AddressSummaryCard
                address={selectedAddress}
                onChangeClick={() => setAddressMode("picker")}
              />
            )}

            {/* Chế độ 2: chọn từ danh sách địa chỉ đã lưu */}
            {addressMode === "picker" && (
              <div className="space-y-2">
                {addresses.map((addr) => (
                  <button
                    key={addr.id}
                    type="button"
                    onClick={() => {
                      setSelectedAddressId(addr.id);
                      setAddressMode("summary");
                    }}
                    className={`flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
                      addr.id === selectedAddressId
                        ? "border-purple bg-lavender/10"
                        : "border-charcoal/12 bg-white hover:border-purple/50"
                    }`}
                  >
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lavender/30 text-purple">
                      <TruckIcon />
                    </span>
                    <span className="min-w-0 flex-1 text-sm">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-charcoal">{addr.recipient_name}</span>
                        {addr.is_default && (
                          <span className="rounded-full bg-purple/10 px-2 py-0.5 text-[9px] font-medium uppercase tracking-[.08em] text-purple">
                            Mặc định
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block font-medium text-charcoal/65">{addr.phone}</span>
                      <span className="mt-1 block leading-relaxed text-charcoal/70">
                        {addr.address_line_1}, {addr.ward}, {addr.district}, {addr.province}
                      </span>
                    </span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setAddressMode("form")}
                  className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-xs font-medium uppercase tracking-[.12em] text-purple hover:text-charcoal"
                >
                  + Nhập địa chỉ mới
                </button>
              </div>
            )}

            {/* Chế độ 3: form nhập tay — mặc định hiện luôn nếu chưa có địa chỉ nào */}
            {addressMode === "form" && (
              <div className="rounded-xl border border-purple/30 bg-white p-1">
                <AddressForm onCancel={handleFormCancel} onSaved={handleAddressSaved} />
              </div>
            )}
          </section>

          {/* Phương thức thanh toán */}
          <section className="rounded-2xl border border-charcoal/10 bg-white/70 p-6 sm:p-8">
            <h2 className="mb-5 text-xs font-semibold uppercase tracking-[.15em] text-charcoal/70">
              Phương thức thanh toán
            </h2>
            <div className="space-y-3">
              {(
                [
                  { value: "cod", label: "Thanh toán khi nhận hàng (COD)" },
                  { value: "bank_transfer", label: "Chuyển khoản ngân hàng" },
                ] as const
              ).map((opt) => (
                <label
                  key={opt.value}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-charcoal/12 bg-white p-4 transition-colors has-[:checked]:border-purple has-[:checked]:bg-lavender/10"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={opt.value}
                    checked={paymentMethod === opt.value}
                    onChange={() => setPaymentMethod(opt.value)}
                    className="accent-purple"
                  />
                  <span className="text-sm font-medium text-charcoal">{opt.label}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Ghi chú */}
          <section className="rounded-2xl border border-charcoal/10 bg-white/70 p-6 sm:p-8">
            <h2 className="mb-5 text-xs font-semibold uppercase tracking-[.15em] text-charcoal/70">
              Ghi chú (không bắt buộc)
            </h2>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-charcoal/12 bg-white p-4 text-sm font-medium outline-none transition-colors focus:border-purple placeholder:font-normal"
              placeholder="Ví dụ: giao giờ hành chính..."
            />
          </section>
        </div>

        {/* CỘT PHẢI — TÓM TẮT ĐƠN HÀNG */}
        <div className="lg:sticky lg:top-24">
          <div className="overflow-hidden rounded-2xl border border-charcoal/10 bg-white/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-3 bg-gradient-to-r from-purple to-purple/80 px-6 py-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-cloud-milk">
                <BoxIcon />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[.15em] text-cloud-milk/70">
                  Đơn hàng DOPAMIND
                </p>
                <h2 className="truncate font-serif text-lg text-cloud-milk">Tóm tắt đơn hàng</h2>
              </div>
            </div>

            <div className="p-6">
              <ul className="space-y-4 border-b border-charcoal/10 pb-5">
                {lines.map((line) => (
                  <li key={line.variantId} className="flex items-center gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-lavender/20">
                      <ProductImage mood={line.mood} className="h-full w-full object-cover" />
                      <span className="absolute -left-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-charcoal text-[10px] font-medium text-cloud-milk">
                        {line.quantity}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-charcoal">{line.nameVi}</p>
                      <p className="text-xs font-medium text-charcoal/55">{formatVnd(line.price)} / sản phẩm</p>
                    </div>
                    <span className="shrink-0 text-sm font-medium text-charcoal">
                      {formatVnd(line.price * line.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 space-y-2 border-b border-charcoal/10 pb-4 text-sm">
                <div className="flex justify-between font-medium text-charcoal/70">
                  <span>Tạm tính</span>
                  <span>{formatVnd(subtotal)}</span>
                </div>
                <div className="flex justify-between font-medium text-charcoal/70">
                  <span>Phí vận chuyển</span>
                  <span>{formatVnd(SHIPPING_FEE)}</span>
                </div>
              </div>

              <div className="mt-5 flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[.06em] text-charcoal">
                    Tổng cộng
                  </p>
                  <p className="text-[10px] font-medium text-charcoal/50">Đã gồm VAT</p>
                </div>
                <span className="shrink-0 text-right font-serif text-[clamp(1.25rem,4vw,1.7rem)] leading-none text-purple">
                  {formatVnd(total)}
                </span>
              </div>

              {error && (
                <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={isPending || !selectedAddressId}
                className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-charcoal px-4 text-xs font-medium uppercase tracking-[.1em] text-cloud-milk transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="truncate">
                  {isPending ? "ĐANG XỬ LÝ..." : `ĐẶT HÀNG · ${formatVnd(total)}`}
                </span>
                {!isPending && <ArrowIcon />}
              </button>

              <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] font-medium text-charcoal/50">
                <LockIcon className="h-3 w-3" />
                Thông tin được mã hoá trong suốt quá trình thanh toán.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}