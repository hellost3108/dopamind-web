import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderStatusForm } from "@/components/admin/OrderStatusForm";
import { getAdminOrder } from "@/lib/admin/data";
import {
  ORDER_STATUS_LABEL,
  ORDER_STATUS_STYLE,
  PAYMENT_METHOD_LABEL,
  PAYMENT_STATUS_LABEL,
  PAYMENT_STATUS_STYLE,
} from "@/lib/admin/labels";
import { formatDateTime } from "@/lib/admin/format";
import { formatVnd } from "@/lib/format";
import { card, chip } from "@/components/admin/ui";

type Address = {
  recipient_name?: string;
  phone?: string;
  address_line_1?: string;
  address_line_2?: string | null;
  ward?: string | null;
  district?: string | null;
  province?: string | null;
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await getAdminOrder(decodeURIComponent(orderNumber));
  if (!order) notFound();

  const addr = (order.shipping_address_snapshot ?? {}) as Address;
  const addressLine = [addr.address_line_1, addr.address_line_2, addr.ward, addr.district, addr.province]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="mx-auto max-w-5xl">
      <Link href="/admin/don-hang" className="text-xs text-charcoal/55 underline-offset-4 hover:underline">
        ← Danh sách đơn hàng
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="font-serif text-3xl text-charcoal sm:text-4xl">{order.order_number}</h1>
        <span className={`${chip} ${ORDER_STATUS_STYLE[order.status] ?? ""}`}>{ORDER_STATUS_LABEL[order.status] ?? order.status}</span>
        <span className={`${chip} ${PAYMENT_STATUS_STYLE[order.payment_status] ?? ""}`}>
          {PAYMENT_STATUS_LABEL[order.payment_status] ?? order.payment_status}
        </span>
      </div>
      <p className="mt-2 text-sm text-charcoal/60">Đặt lúc {formatDateTime(order.created_at)}</p>

      <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(280px,1fr)]">
        <div className="space-y-5">
          <section className={card}>
            <h2 className="font-serif text-xl text-charcoal">Sản phẩm</h2>
            <ul className="mt-4 divide-y divide-charcoal/10">
              {order.items.map((it) => (
                <li key={it.id} className="flex items-start justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-charcoal">{it.product_name_snapshot}</p>
                    {it.variant_name_snapshot !== it.product_name_snapshot && (
                      <p className="text-xs text-charcoal/55">{it.variant_name_snapshot}</p>
                    )}
                    <p className="mt-0.5 text-xs text-charcoal/55">
                      {formatVnd(Number(it.unit_price))} × {it.quantity}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm text-charcoal">{formatVnd(Number(it.line_total))}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-1.5 border-t border-charcoal/10 pt-4 text-sm">
              <div className="flex justify-between"><dt className="text-charcoal/60">Tạm tính</dt><dd>{formatVnd(Number(order.subtotal))}</dd></div>
              {Number(order.discount_amount) > 0 && (
                <div className="flex justify-between"><dt className="text-charcoal/60">Giảm giá</dt><dd>-{formatVnd(Number(order.discount_amount))}</dd></div>
              )}
              <div className="flex justify-between"><dt className="text-charcoal/60">Phí vận chuyển</dt><dd>{formatVnd(Number(order.shipping_fee))}</dd></div>
              <div className="flex justify-between text-base font-medium text-charcoal"><dt>Tổng cộng</dt><dd>{formatVnd(Number(order.total_amount))}</dd></div>
            </dl>
          </section>

          <section className={card}>
            <h2 className="font-serif text-xl text-charcoal">Khách hàng &amp; giao hàng</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div><dt className="text-xs text-charcoal/50">Người nhận</dt><dd className="text-charcoal">{order.recipient_name}</dd></div>
              <div><dt className="text-xs text-charcoal/50">Số điện thoại</dt><dd><a href={`tel:${order.phone}`} className="text-purple underline-offset-4 hover:underline">{order.phone}</a></dd></div>
              <div><dt className="text-xs text-charcoal/50">Email</dt><dd className="break-all text-charcoal">{order.customer_email}</dd></div>
              <div><dt className="text-xs text-charcoal/50">Địa chỉ</dt><dd className="text-charcoal">{addressLine || "—"}</dd></div>
              {order.customer_note && (
                <div><dt className="text-xs text-charcoal/50">Ghi chú của khách</dt><dd className="whitespace-pre-wrap text-charcoal">{order.customer_note}</dd></div>
              )}
              {order.status === "cancelled" && (
                <div>
                  <dt className="text-xs text-charcoal/50">Đã hủy{order.cancelled_at ? ` lúc ${formatDateTime(order.cancelled_at)}` : ""}</dt>
                  <dd className="text-charcoal">{order.cancel_reason || "—"}</dd>
                </div>
              )}
            </dl>
          </section>

          {order.payments.length > 0 && (
            <section className={card}>
              <h2 className="font-serif text-xl text-charcoal">Thanh toán</h2>
              <ul className="mt-4 divide-y divide-charcoal/10 text-sm">
                {order.payments.map((p) => (
                  <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                    <div>
                      <p className="text-charcoal">{PAYMENT_METHOD_LABEL[p.method ?? ""] ?? p.method ?? p.provider}</p>
                      {p.paid_at && <p className="text-xs text-charcoal/55">Thu lúc {formatDateTime(p.paid_at)}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-charcoal">{formatVnd(Number(p.amount))}</p>
                      <p className="text-xs text-charcoal/55">{PAYMENT_STATUS_LABEL[p.status] ?? p.status}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <section className={`${card} h-fit lg:sticky lg:top-8`}>
          <h2 className="font-serif text-xl text-charcoal">Xử lý đơn</h2>
          <div className="mt-5">
            <OrderStatusForm orderId={order.id} status={order.status} paymentStatus={order.payment_status} />
          </div>
        </section>
      </div>
    </div>
  );
}
