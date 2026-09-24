import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/pages/PageIntro";
import { requireUser } from "@/lib/supabase/dal";
import { getMyOrderByNumber } from "@/lib/supabase/orders";
import { formatVnd } from "@/lib/format";

const STATUS_LABEL_VI: Record<string, string> = {
  pending: "Chờ xử lý",
  confirmed: "Đã xác nhận",
  processing: "Đang chuẩn bị",
  shipping: "Đang giao",
  completed: "Hoàn tất",
  cancelled: "Đã hủy",
  refunded: "Đã hoàn tiền",
};

const PAYMENT_STATUS_LABEL_VI: Record<string, string> = {
  unpaid: "Chưa thanh toán",
  pending: "Đang xử lý",
  paid: "Đã thanh toán",
  failed: "Thất bại",
  refunded: "Đã hoàn tiền",
  partially_refunded: "Hoàn tiền một phần",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}): Promise<Metadata> {
  const { orderNumber } = await params;
  return { title: `Đơn hàng ${orderNumber} | DOPAMIND` };
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  await requireUser(`/tai-khoan/don-hang/${orderNumber}`);
  const order = await getMyOrderByNumber(orderNumber);

  return (
    <>
      <PageIntro
        eyebrow="Tài khoản DOPAMIND"
        title={
          <>
            Chi tiết
            <br />
            <span className="text-purple">đơn hàng.</span>
          </>
        }
        body={order ? order.order_number : "Không tìm thấy đơn hàng."}
      />
      <section className="px-[clamp(20px,4vw,64px)] py-[clamp(56px,8vw,120px)]">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/tai-khoan/don-hang"
            className="mb-10 inline-flex min-h-11 items-center text-xs uppercase tracking-[.12em] text-charcoal/50 hover:text-charcoal"
          >
            ← ĐƠN HÀNG
          </Link>

          {!order ? (
            <p className="text-sm leading-relaxed text-charcoal/55">
              Không tìm thấy đơn hàng này, hoặc đơn hàng không thuộc về tài khoản của bạn.
            </p>
          ) : (
            <>
              <div className="grid gap-6 border-b border-charcoal/10 pb-8 sm:grid-cols-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[.16em] text-charcoal/45">Ngày đặt</p>
                  <p className="mt-2 text-sm text-charcoal">
                    {new Date(order.created_at).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[.16em] text-charcoal/45">Trạng thái</p>
                  <p className="mt-2 text-sm text-charcoal">
                    {STATUS_LABEL_VI[order.status] ?? order.status}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[.16em] text-charcoal/45">Thanh toán</p>
                  <p className="mt-2 text-sm text-charcoal">
                    {PAYMENT_STATUS_LABEL_VI[order.payment_status] ?? order.payment_status}
                  </p>
                </div>
              </div>

              <ul className="border-b border-charcoal/10">
                {order.order_items.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-4 py-5">
                    <div>
                      <p className="text-sm font-medium text-charcoal">{item.product_name_snapshot}</p>
                      <p className="mt-1 text-xs uppercase tracking-[.1em] text-charcoal/45">
                        {item.variant_name_snapshot} · SL {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm text-charcoal">{formatVnd(item.line_total)}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-col gap-2 text-sm">
                <div className="flex items-center justify-between text-charcoal/60">
                  <span>Tạm tính</span>
                  <span>{formatVnd(order.subtotal)}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex items-center justify-between text-charcoal/60">
                    <span>Giảm giá</span>
                    <span>-{formatVnd(order.discount_amount)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-charcoal/60">
                  <span>Phí vận chuyển</span>
                  <span>{formatVnd(order.shipping_fee)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-charcoal/10 pt-2 text-base font-medium text-charcoal">
                  <span>Tổng cộng</span>
                  <span>{formatVnd(order.total_amount)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
