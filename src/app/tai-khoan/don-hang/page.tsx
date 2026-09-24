import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/pages/PageIntro";
import { requireUser } from "@/lib/supabase/dal";
import { listMyOrders } from "@/lib/supabase/orders";
import { formatVnd } from "@/lib/format";

export const metadata: Metadata = { title: "Đơn hàng | DOPAMIND" };

const STATUS_LABEL_VI: Record<string, string> = {
  pending: "Chờ xử lý",
  confirmed: "Đã xác nhận",
  processing: "Đang chuẩn bị",
  shipping: "Đang giao",
  completed: "Hoàn tất",
  cancelled: "Đã hủy",
  refunded: "Đã hoàn tiền",
};

export default async function OrdersPage() {
  await requireUser("/tai-khoan/don-hang");
  const orders = await listMyOrders();

  return (
    <>
      <PageIntro
        eyebrow="Tài khoản DOPAMIND"
        title={
          <>
            Đơn hàng
            <br />
            <span className="text-purple">của bạn.</span>
          </>
        }
        body="Theo dõi trạng thái các đơn hàng đã đặt tại DOPAMIND."
      />
      <section className="px-[clamp(20px,4vw,64px)] py-[clamp(56px,8vw,120px)]">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/tai-khoan"
            className="mb-10 inline-flex min-h-11 items-center text-xs uppercase tracking-[.12em] text-charcoal/50 hover:text-charcoal"
          >
            ← TÀI KHOẢN
          </Link>

          {orders.length === 0 ? (
            <p className="text-sm leading-relaxed text-charcoal/55">
              Bạn chưa có đơn hàng nào. Khi bạn đặt hàng, đơn sẽ xuất hiện ở đây.
            </p>
          ) : (
            <ul className="border-t border-charcoal/10">
              {orders.map((order) => (
                <li key={order.id} className="border-b border-charcoal/10 py-5">
                  <Link
                    href={`/tai-khoan/don-hang/${order.order_number}`}
                    className="flex flex-wrap items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-charcoal">{order.order_number}</p>
                      <p className="mt-1 text-xs uppercase tracking-[.1em] text-charcoal/45">
                        {new Date(order.created_at).toLocaleDateString("vi-VN")} ·{" "}
                        {STATUS_LABEL_VI[order.status] ?? order.status}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-charcoal">{formatVnd(order.total_amount)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
