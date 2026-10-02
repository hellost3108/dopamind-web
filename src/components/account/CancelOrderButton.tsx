"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cancelOrderAction } from "@/lib/supabase/cancel-order-action";

const OTHER = "Lý do khác";
const REASONS = [
  "Đổi ý, không muốn mua nữa",
  "Đặt nhầm sản phẩm",
  "Muốn đổi địa chỉ hoặc thông tin nhận hàng",
  "Tìm được giá tốt hơn",
  OTHER,
];

const fieldClass =
  "mt-2 h-[52px] w-full rounded-2xl border border-charcoal/15 bg-white px-[18px] text-[15px] text-charcoal outline-none transition focus:border-purple focus:ring-4 focus:ring-purple/20 placeholder:text-charcoal/35";

export function CancelOrderButton({
  orderNumber,
  phone,
  onCancelled,
}: {
  orderNumber: string;
  /** Chỉ cần với khách vãng lai (chưa đăng nhập). */
  phone?: string;
  /** Gọi sau khi hủy xong. Nếu không truyền, trang sẽ tự tải lại. */
  onCancelled?: () => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(REASONS[0]);
  const [other, setOther] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ needsRefund: boolean } | null>(null);

  async function confirmCancel() {
    setError(null);
    setLoading(true);
    try {
      const finalReason = reason === OTHER ? other.trim() || OTHER : reason;
      const res = await cancelOrderAction(orderNumber, finalReason, phone);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setDone({ needsRefund: res.needsRefund });
    } finally {
      setLoading(false);
    }
  }

  function closeDone() {
    setOpen(false);
    if (onCancelled) onCancelled();
    else router.refresh();
  }

  if (done) {
    return (
      <div className="w-full rounded-[22px] border border-charcoal/10 bg-white p-6 text-sm">
        <p className="font-serif text-xl text-charcoal">Đơn {orderNumber} đã được hủy.</p>
        {done.needsRefund && (
          <p className="mt-2 leading-relaxed text-charcoal/65">
            Đơn này đã thanh toán. DOPAMIND sẽ liên hệ để hoàn tiền cho bạn.
          </p>
        )}
        <button
          type="button"
          onClick={closeDone}
          className="mt-5 flex h-12 items-center justify-center rounded-full bg-charcoal px-8 text-xs font-medium uppercase tracking-[.18em] text-cloud-milk transition duration-300 hover:bg-purple hover:text-white"
        >
          ĐÓNG
        </button>
      </div>
    );
  }

  if (!open) {
    return (
      <div className="flex w-full justify-end">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-10 items-center justify-center rounded-full border border-charcoal/20 bg-white px-6 text-[11px] font-medium uppercase tracking-[.16em] text-charcoal/70 transition-colors hover:border-rose-400 hover:text-rose-600"
        >
          Hủy đơn
        </button>
      </div>
    );
  }

  return (
    <div className="w-full rounded-[22px] border border-charcoal/10 bg-white p-6">
      <p className="font-serif text-xl text-charcoal">Bạn muốn hủy đơn {orderNumber}?</p>
      <p className="mt-2 text-[13px] leading-relaxed text-charcoal/55">
        Sau khi hủy, đơn không thể khôi phục. Bạn có thể đặt lại đơn mới bất cứ lúc nào.
      </p>

      <label
        className="mt-5 block text-[11px] font-medium uppercase tracking-[.2em] text-charcoal/55"
        htmlFor={`cancel-reason-${orderNumber}`}
      >
        Lý do hủy
      </label>
      <select
        id={`cancel-reason-${orderNumber}`}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className={fieldClass}
      >
        {REASONS.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>

      {reason === OTHER && (
        <input
          value={other}
          onChange={(e) => setOther(e.target.value)}
          maxLength={200}
          placeholder="Nhập lý do của bạn"
          className={fieldClass}
        />
      )}

      {error && (
        <p className="mt-4 rounded-xl border-l-2 border-peach bg-peach/10 px-3 py-2 text-sm leading-relaxed text-charcoal">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={confirmCancel}
          disabled={loading}
          className="flex h-12 items-center justify-center rounded-full bg-rose-600 px-8 text-xs font-medium uppercase tracking-[.16em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "ĐANG HỦY..." : "XÁC NHẬN HỦY"}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setError(null);
          }}
          disabled={loading}
          className="flex h-12 items-center justify-center rounded-full border border-charcoal/25 px-8 text-xs font-medium uppercase tracking-[.16em] text-charcoal/70 transition-colors hover:border-charcoal hover:bg-charcoal hover:text-cloud-milk"
        >
          GIỮ ĐƠN HÀNG
        </button>
      </div>
    </div>
  );
}
