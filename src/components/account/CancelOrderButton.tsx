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
      <div className="w-full rounded-2xl border border-charcoal/10 bg-white p-5 text-sm">
        <p className="font-medium text-charcoal">Đơn {orderNumber} đã được hủy.</p>
        {done.needsRefund && (
          <p className="mt-2 leading-relaxed text-charcoal/65">
            Đơn này đã thanh toán. DOPAMIND sẽ liên hệ để hoàn tiền cho bạn.
          </p>
        )}
        <button
          type="button"
          onClick={closeDone}
          className="mt-4 flex min-h-11 items-center justify-center rounded-full bg-charcoal px-6 text-xs font-medium uppercase tracking-[.13em] text-cloud-milk transition-opacity hover:opacity-90"
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
          className="flex min-h-10 items-center justify-center rounded-full border border-charcoal/20 px-5 text-xs font-medium uppercase tracking-[.12em] text-charcoal/70 transition-colors hover:border-rose-400 hover:text-rose-600"
        >
          Hủy đơn
        </button>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-charcoal/10 bg-white p-5">
      <p className="text-sm font-medium text-charcoal">Bạn muốn hủy đơn {orderNumber}?</p>
      <p className="mt-1 text-xs leading-relaxed text-charcoal/55">
        Sau khi hủy, đơn không thể khôi phục. Bạn có thể đặt lại đơn mới bất cứ lúc nào.
      </p>

      <label className="mt-4 block text-[10px] font-medium uppercase tracking-[.16em] text-charcoal/55" htmlFor={`cancel-reason-${orderNumber}`}>
        Lý do hủy
      </label>
      <select
        id={`cancel-reason-${orderNumber}`}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="mt-2 min-h-11 w-full rounded-xl border border-charcoal/15 bg-white px-3 text-sm font-medium text-charcoal outline-none focus:border-purple"
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
          className="mt-3 min-h-11 w-full rounded-xl border border-charcoal/15 bg-white px-4 text-sm font-medium text-charcoal outline-none focus:border-purple placeholder:font-normal placeholder:text-charcoal/30"
        />
      )}

      {error && (
        <p className="mt-4 rounded-xl border-l-2 border-peach bg-peach/10 px-3 py-2 text-sm leading-relaxed text-charcoal">
          {error}
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={confirmCancel}
          disabled={loading}
          className="flex min-h-11 items-center justify-center rounded-full bg-rose-600 px-6 text-xs font-medium uppercase tracking-[.13em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
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
          className="flex min-h-11 items-center justify-center rounded-full border border-charcoal/20 px-6 text-xs font-medium uppercase tracking-[.12em] text-charcoal/70 hover:border-charcoal hover:text-charcoal"
        >
          GIỮ ĐƠN HÀNG
        </button>
      </div>
    </div>
  );
}
