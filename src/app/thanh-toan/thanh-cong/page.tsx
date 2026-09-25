import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/supabase/dal";
import { getMyOrderByNumber } from "@/lib/supabase/orders";

export const metadata: Metadata = { title: "Đặt hàng thành công | DOPAMIND" };

function formatVnd(amount: number) {
  return amount.toLocaleString("vi-VN") + "đ";
}

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  await requireUser("/thanh-toan");
  const { order: orderNumber } = await searchParams;
  if (!orderNumber) notFound();

  const order = await getMyOrderByNumber(orderNumber);
  if (!order) notFound();

  return (
    <section className="flex min-h-[60vh] items-center justify-center px-5 py-20">
      <div className="w-full max-w-md text-center">
        <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-purple/10 text-purple">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
        <h1 className="font-serif text-2xl text-charcoal">Đặt hàng thành công</h1>
        <p className="mt-3 text-sm font-medium text-charcoal/70">
          Mã đơn hàng <span className="font-semibold text-charcoal">{order.order_number}</span>.
          DOPAMIND sẽ liên hệ xác nhận sớm nhất.
        </p>
        <p className="mt-1 text-sm font-medium text-charcoal/70">
          Tổng cộng: {formatVnd(Number(order.total_amount))}
        </p>
        <Link
          href="/san-pham"
          className="mt-8 inline-flex min-h-11 items-center rounded-full bg-charcoal px-6 text-xs uppercase tracking-[.13em] text-cloud-milk"
        >
          TIẾP TỤC MUA SẮM
        </Link>
      </div>
    </section>
  );
}