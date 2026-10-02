"use client";

import { useState } from "react";
import { lookupGuestOrder } from "@/app/tra-cuu-don-hang/actions";
import type { GuestOrder } from "@/lib/supabase/orders";

const STATUS_LABEL_VI: Record<string, string> = {
  pending: "Chờ xử lý",
  confirmed: "Đã xác nhận",
  processing: "Đang chuẩn bị",
  shipping: "Đang giao",
  completed: "Hoàn tất",
  cancelled: "Đã hủy",
  refunded: "Đã hoàn tiền",
};

const inputClass =
  "w-full rounded-xl border border-charcoal/12 bg-white p-3.5 text-sm font-medium outline-none transition-colors focus:border-purple placeholder:font-normal placeholder:text-charcoal/35";
const labelClass = "mb-1.5 block text-[11px] font-medium uppercase tracking-[.08em] text-charcoal/50";
const vnd = (n: number) => `${new Intl.NumberFormat("vi-VN").format(n)}đ`;

export default function TraCuuDonHangPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<GuestOrder | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOrder(null);

    if (!orderNumber.trim() || !phone.trim()) {
      setError("Vui lòng nhập đầy đủ mã đơn hàng và số điện thoại.");
      return;
    }

    setLoading(true);
    try {
      const result = await lookupGuestOrder(orderNumber, phone);
      if (!result.ok) {
        setError(result.error);
      } else {
        setOrder(result.order);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="px-[clamp(20px,4vw,64px)] py-[clamp(56px,8vw,120px)]">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs uppercase tracking-[.16em] text-charcoal/45">Theo dõi đơn hàng</p>
        <h1 className="mt-3 text-[clamp(30px,4.5vw,48px)] font-medium leading-[1.1] tracking-tight text-charcoal">
          Tra cứu <span className="text-purple">đơn hàng.</span>
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-charcoal/55">
          Nhập mã đơn hàng và số điện thoại bạn đã dùng khi đặt hàng để xem tình trạng đơn.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-2xl border border-charcoal/10 bg-white/70 p-6 sm:p-8">
          <div>
            <label className={labelClass}>Mã đơn hàng</label>
            <input
              className={inputClass}
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="DPM260925XXXXX"
            />
          </div>
          <div>
            <label className={labelClass}>Số điện thoại đã đặt hàng</label>
            <input
              className={inputClass}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0901 234 567"
              type="tel"
            />
          </div>

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex min-h-12 w-full items-center justify-center rounded-full bg-charcoal text-xs font-medium uppercase tracking-[.13em] text-cloud-milk transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Đang tra cứu..." : "Tra cứu"}
          </button>
        </form>

        {order && (
          <div className="mt-6 rounded-2xl border border-charcoal/10 bg-white/80 p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-charcoal/10 pb-5">
              <div>
                <p className="text-sm font-medium text-charcoal">{order.order_number}</p>
                <p className="mt-1 text-xs text-charcoal/50">
                  Đặt ngày {new Date(order.created_at).toLocaleDateString("vi-VN")}
                </p>
              </div>
              <span className="rounded-full bg-purple/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[.08em] text-purple">
                {STATUS_LABEL_VI[order.status] ?? order.status}
              </span>
            </div>

            {order.shipping_address_snapshot && (
              <div className="border-b border-charcoal/10 py-5 text-sm">
                <p className="font-medium text-charcoal">{order.recipient_name}</p>
                <p className="mt-0.5 text-charcoal/60">{order.phone}</p>
                <p className="mt-1 leading-relaxed text-charcoal/70">
                  {order.shipping_address_snapshot.address_line_1}
                  {order.shipping_address_snapshot.address_line_2
                    ? `, ${order.shipping_address_snapshot.address_line_2}`
                    : ""}
                  , {order.shipping_address_snapshot.ward}, {order.shipping_address_snapshot.district},{" "}
                  {order.shipping_address_snapshot.province}
                </p>
              </div>
            )}

            <ul className="space-y-3 border-b border-charcoal/10 py-5">
              {order.items.map((item, i) => (
                <li key={i} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-charcoal/70">
                    {item.product_name} × {item.quantity}
                  </span>
                  <span className="font-medium text-charcoal">{vnd(item.line_total)}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between pt-5">
              <span className="text-sm font-medium text-charcoal/70">Tổng cộng</span>
              <span className="font-serif text-xl text-purple">{vnd(order.total_amount)}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
