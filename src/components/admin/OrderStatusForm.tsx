"use client";

import { useActionState, useState } from "react";
import { updateOrderAction, type FormState } from "@/app/admin/actions";
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABEL,
  PAYMENT_STATUSES,
  PAYMENT_STATUS_LABEL,
} from "@/lib/admin/labels";
import { btnPrimary, inputCls, labelCls } from "@/components/admin/ui";

export function OrderStatusForm({
  orderId,
  status,
  paymentStatus,
}: {
  orderId: string;
  status: string;
  paymentStatus: string;
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(updateOrderAction, undefined);
  const [nextStatus, setNextStatus] = useState(status);
  const locked = status === "cancelled";

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (nextStatus === "cancelled" && status !== "cancelled") {
          const ok = confirm("Hủy đơn hàng này?\n\nTồn kho sẽ được cộng lại và đơn đã hủy KHÔNG thể mở lại.");
          if (!ok) e.preventDefault();
        }
      }}
      className="space-y-4"
    >
      <input type="hidden" name="order_id" value={orderId} />

      <div>
        <label htmlFor="status" className={labelCls}>Trạng thái đơn hàng</label>
        <select
          id="status"
          name="status"
          value={nextStatus}
          onChange={(e) => setNextStatus(e.target.value)}
          disabled={locked}
          className={inputCls}
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>{ORDER_STATUS_LABEL[s]}</option>
          ))}
        </select>
        {locked && <input type="hidden" name="status" value="cancelled" />}
      </div>

      <div>
        <label htmlFor="payment_status" className={labelCls}>Trạng thái thanh toán</label>
        <select id="payment_status" name="payment_status" defaultValue={paymentStatus} className={inputCls}>
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>{PAYMENT_STATUS_LABEL[s]}</option>
          ))}
        </select>
      </div>

      {nextStatus === "cancelled" && !locked && (
        <div>
          <label htmlFor="reason" className={labelCls}>Lý do hủy (không bắt buộc)</label>
          <textarea id="reason" name="reason" rows={2} maxLength={500} className={inputCls} placeholder="Ví dụ: Khách yêu cầu hủy" />
          <p className="mt-1 text-[11px] text-charcoal/50">Hủy đơn sẽ tự cộng lại tồn kho.</p>
        </div>
      )}

      {locked && (
        <p className="text-xs text-charcoal/55">Đơn đã hủy nên không thể đổi trạng thái đơn. Bạn vẫn có thể chỉnh trạng thái thanh toán (ví dụ đã hoàn tiền).</p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending} className={btnPrimary}>
          {pending ? "Đang lưu..." : "Cập nhật"}
        </button>
        {state?.error && <p role="alert" className="text-sm text-red-600">{state.error}</p>}
        {state?.ok && <p role="status" className="text-sm text-emerald-700">{state.ok}</p>}
      </div>
    </form>
  );
}
