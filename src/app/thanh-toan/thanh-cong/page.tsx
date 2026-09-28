import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/supabase/dal";
import { getMyOrderByNumber } from "@/lib/supabase/orders";
import AutoRefresh from "./AutoRefresh";

export const metadata: Metadata = { title: "Đơn hàng | DOPAMIND" };

const BANK = {
  code: "BIDV",
  name: "BIDV",
  accountNumber: "0384380428",
  accountName: "LAI THE NHAT MINH",
};

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

  const total = Number(order.total_amount);
  const isBankTransfer = order.payments?.[0]?.method === "bank_transfer";
  const isPaid = order.payment_status === "paid";
  const awaitingPayment = isBankTransfer && !isPaid;
  const qrUrl =
    `https://img.vietqr.io/image/${BANK.code}-${BANK.accountNumber}-compact2.png` +
    `?amount=${Math.round(total)}` +
    `&addInfo=${encodeURIComponent(order.order_number)}` +
    `&accountName=${encodeURIComponent(BANK.accountName)}`;

  return (
    <section className="flex min-h-[60vh] items-center justify-center px-5 py-20">
      <div className="w-full max-w-md text-center">
                {awaitingPayment && <AutoRefresh />}
        {awaitingPayment ? (
          <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
          </span>
        ) : (
          <span className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-purple/10 text-purple">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </span>
        )}

        <h1 className="font-serif text-2xl text-charcoal">
          {awaitingPayment ? "Đơn hàng đã tạo, chờ thanh toán" : "Đặt hàng thành công"}
        </h1>
        <p className="mt-3 text-sm font-medium text-charcoal/70">
          Mã đơn hàng <span className="font-semibold text-charcoal">{order.order_number}</span>.
          {awaitingPayment
            ? " Đơn chỉ được xác nhận sau khi DOPAMIND nhận được tiền."
            : " DOPAMIND sẽ liên hệ xác nhận sớm nhất."}
        </p>
        <p className="mt-1 text-sm font-medium text-charcoal/70">
          {awaitingPayment ? "Số tiền cần chuyển: " : "Tổng cộng: "}
          {formatVnd(total)}
        </p>

        {awaitingPayment && (
          <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-left text-sm text-charcoal">
            <p className="font-semibold">Bước cuối: hãy chuyển khoản để hoàn tất đơn</p>
            <p className="mt-1 text-charcoal/70">
              Quét mã QR hoặc chuyển theo thông tin bên dưới. Đơn hàng chưa được xử lý
              và chưa được giao cho đến khi bạn chuyển khoản.
            </p>
          </div>
        )}

        {awaitingPayment && (
          <div className="mt-4 rounded-2xl border border-charcoal/10 bg-white p-5 text-left">
            <h2 className="text-center text-sm font-semibold text-charcoal">
              Thông tin chuyển khoản
            </h2>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qrUrl}
              alt={`Mã QR chuyển khoản đơn ${order.order_number}`}
              width={240}
              height={240}
              className="mx-auto mt-4 h-auto w-60 max-w-full"
            />
            <p className="mt-2 text-center text-xs text-charcoal/60">
              Quét mã bằng app ngân hàng, số tiền và nội dung sẽ tự điền.
            </p>
            <dl className="mt-4 space-y-2 text-sm text-charcoal">
              <div className="flex justify-between gap-4">
                <dt className="text-charcoal/60">Ngân hàng</dt>
                <dd className="font-semibold">{BANK.name}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-charcoal/60">Số tài khoản</dt>
                <dd className="font-semibold">{BANK.accountNumber}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-charcoal/60">Chủ tài khoản</dt>
                <dd className="font-semibold">{BANK.accountName}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-charcoal/60">Số tiền</dt>
                <dd className="font-semibold">{formatVnd(total)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-charcoal/60">Nội dung</dt>
                <dd className="font-semibold">{order.order_number}</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs text-charcoal/60">
              Vui lòng ghi đúng nội dung chuyển khoản để DOPAMIND xác nhận đơn nhanh hơn.
            </p>
          </div>
        )}

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
