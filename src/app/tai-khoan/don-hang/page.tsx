import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/supabase/dal";
import { listMyOrders } from "@/lib/supabase/orders";
import { formatVnd } from "@/lib/format";
import { CancelOrderButton } from "@/components/account/CancelOrderButton";

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

// Màu trạng thái theo bảng màu DOPAMIND
const STATUS_STYLE: Record<string, string> = {
  pending: "bg-butter/60 text-charcoal",
  confirmed: "bg-lavender/60 text-charcoal",
  processing: "bg-lavender text-charcoal",
  shipping: "bg-purple/15 text-purple",
  completed: "bg-mint text-charcoal",
  cancelled: "bg-peach/50 text-charcoal",
  refunded: "bg-charcoal/10 text-charcoal/70",
};

// Bước tiến trình giao hàng (5 chặng)
const STEP: Record<string, number> = { pending: 1, confirmed: 2, processing: 3, shipping: 4, completed: 5 };

// Đơn ở các trạng thái này khách được tự hủy
const CANCELLABLE = ["pending", "confirmed"];

const TABS: { key: string; label: string; match: string[] | null }[] = [
  { key: "tat-ca", label: "Tất cả", match: null },
  { key: "dang-xu-ly", label: "Đang xử lý", match: ["pending", "confirmed", "processing"] },
  { key: "dang-giao", label: "Đang giao", match: ["shipping"] },
  { key: "hoan-tat", label: "Hoàn tất", match: ["completed"] },
  { key: "da-huy", label: "Đã hủy", match: ["cancelled", "refunded"] },
];

const ACCOUNT_NAV = [
  { href: "/tai-khoan", label: "Tài khoản" },
  { href: "/tai-khoan/don-hang", label: "Đơn hàng", active: true },
  { href: "/tai-khoan/dia-chi", label: "Địa chỉ" },
  { href: "/yeu-thich", label: "Yêu thích" },
];

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await requireUser("/tai-khoan/don-hang");
  const orders = await listMyOrders();
  const sp = await searchParams;
  const raw = sp["trang-thai"];
  const activeKey = (Array.isArray(raw) ? raw[0] : raw) ?? "tat-ca";
  const tab = TABS.find((t) => t.key === activeKey) ?? TABS[0];

  const shown = tab.match ? orders.filter((o) => tab.match!.includes(o.status)) : orders;
  const inProgress = orders.filter((o) => ["pending", "confirmed", "processing", "shipping"].includes(o.status)).length;
  const total = orders.reduce((sum, o) => sum + Number(o.total_amount), 0);

  return (
    <>
      {/* Tiêu đề: cùng kiểu với trang Hồ sơ */}
      <section className="relative overflow-hidden px-[clamp(20px,4vw,64px)] pb-[clamp(40px,5vw,72px)] pt-[clamp(48px,6vw,88px)]">
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-80 w-[46rem] max-w-full -translate-x-1/2 rounded-full bg-lavender/50 blur-3xl"
        />
        <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
          <div className="flex items-center gap-4">
            <span aria-hidden className="h-px w-10 bg-charcoal/25" />
            <p className="text-[10px] font-medium uppercase tracking-[.32em] text-charcoal/55">
              Tài khoản DOPAMIND
            </p>
            <span aria-hidden className="h-px w-10 bg-charcoal/25" />
          </div>
          <h1 className="mt-8 font-serif text-[clamp(2.25rem,5vw,4rem)] font-light leading-[1.15] tracking-[-.01em] text-charcoal">
            Đơn hàng
            <br />
            <span className="text-purple">của bạn.</span>
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-charcoal/60">
            Theo dõi trạng thái các đơn hàng đã đặt tại DOPAMIND.
          </p>

          <nav aria-label="Tài khoản" className="mt-10 flex flex-wrap justify-center gap-2">
            {ACCOUNT_NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={n.active ? "page" : undefined}
                className={`inline-flex min-h-10 items-center rounded-full border px-5 text-xs uppercase tracking-[.12em] transition ${
                  n.active
                    ? "border-charcoal bg-charcoal text-white"
                    : "border-charcoal/15 bg-white/60 text-charcoal/60 hover:border-charcoal/40 hover:text-charcoal"
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section className="px-[clamp(16px,4vw,64px)] pb-[clamp(56px,8vw,120px)]">
        <div className="mx-auto max-w-4xl">
          {/* Thống kê nhanh */}
          {orders.length > 0 && (
            <dl className="grid gap-4 sm:grid-cols-3">
              {[
                { k: "Tổng đơn", v: String(orders.length), dot: "bg-lavender" },
                { k: "Đang xử lý", v: String(inProgress), dot: "bg-butter" },
                { k: "Tổng giá trị", v: formatVnd(total), dot: "bg-mint" },
              ].map((s) => (
                <div
                  key={s.k}
                  className="relative overflow-hidden rounded-[24px] border border-charcoal/10 bg-white p-6"
                >
                  <span aria-hidden className={`absolute right-5 top-5 h-3 w-3 rounded-full ${s.dot}`} />
                  <dt className="text-[11px] font-medium uppercase tracking-[.2em] text-charcoal/50">{s.k}</dt>
                  <dd className="mt-3 font-serif text-[clamp(1.9rem,3vw,2.4rem)] font-medium leading-none text-charcoal">
                    {s.v}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {/* Bộ lọc trạng thái */}
          <div
            className="mt-10 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap"
            role="group"
            aria-label="Lọc theo trạng thái"
          >
            {TABS.map((t) => (
              <Link
                key={t.key}
                href={t.key === "tat-ca" ? "/tai-khoan/don-hang" : `/tai-khoan/don-hang?trang-thai=${t.key}`}
                aria-current={t.key === tab.key ? "true" : undefined}
                className={`inline-flex min-h-10 shrink-0 items-center rounded-full border px-5 text-sm transition ${
                  t.key === tab.key
                    ? "border-purple bg-purple text-white"
                    : "border-charcoal/15 bg-white text-charcoal/70 hover:border-purple/50"
                }`}
              >
                {t.label}
              </Link>
            ))}
          </div>

          {/* Danh sách */}
          {shown.length === 0 ? (
            <div className="mt-8 rounded-[26px] border border-dashed border-charcoal/20 bg-white/70 px-6 py-16 text-center">
              <p className="font-serif text-2xl text-charcoal">
                {orders.length === 0
                  ? "Bạn chưa có đơn hàng nào"
                  : tab.key === "da-huy"
                  ? "Bạn chưa có đơn nào đã hủy"
                  : "Không có đơn nào ở mục này"}
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-charcoal/55">
                {orders.length === 0
                  ? "Khi bạn đặt hàng, đơn sẽ xuất hiện ở đây."
                  : "Thử chọn một trạng thái khác để xem các đơn còn lại."}
              </p>
              <Link
                href={orders.length === 0 ? "/san-pham" : "/tai-khoan/don-hang"}
                className="mt-7 inline-flex h-[52px] items-center rounded-full bg-charcoal px-9 text-xs font-medium uppercase tracking-[.18em] text-white transition duration-300 hover:-translate-y-0.5 hover:bg-purple"
              >
                {orders.length === 0 ? "Khám phá sản phẩm" : "Xem tất cả đơn"}
              </Link>
            </div>
          ) : (
            <ul className="mt-8 space-y-5">
              {shown.map((order) => {
                const step = STEP[order.status];
                const isCancelled = order.status === "cancelled" || order.status === "refunded";
                const canCancel = CANCELLABLE.includes(order.status);
                return (
                  <li
                    key={order.id}
                    className={`overflow-hidden rounded-[26px] border border-charcoal/10 transition duration-300 hover:border-purple/40 hover:shadow-[0_18px_40px_-26px_rgba(90,50,200,.45)] ${
                      isCancelled ? "bg-white/60" : "bg-white"
                    }`}
                  >
                    <Link
                      href={`/tai-khoan/don-hang/${order.order_number}`}
                      className="group block p-6 sm:p-7"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[11px] font-medium uppercase tracking-[.2em] text-charcoal/45">
                            Mã đơn
                          </p>
                          <p
                            className={`mt-1 font-serif text-[clamp(1.25rem,2.4vw,1.6rem)] font-medium leading-tight tracking-wide ${
                              isCancelled ? "text-charcoal/50" : "text-charcoal"
                            }`}
                          >
                            {order.order_number}
                          </p>
                          <p className="mt-1 text-[13px] text-charcoal/55">
                            Đặt ngày {new Date(order.created_at).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                        <p
                          className={`font-serif text-[clamp(1.25rem,2.4vw,1.6rem)] font-medium ${
                            isCancelled ? "text-charcoal/40 line-through" : "text-charcoal"
                          }`}
                        >
                          {formatVnd(order.total_amount)}
                        </p>
                      </div>

                      <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-charcoal/10 pt-5">
                        <span
                          className={`rounded-full px-4 py-1.5 text-[11px] font-medium uppercase tracking-[.1em] ${
                            STATUS_STYLE[order.status] ?? "bg-charcoal/10 text-charcoal/70"
                          }`}
                        >
                          {STATUS_LABEL_VI[order.status] ?? order.status}
                        </span>
                        {step && (
                          <div className="flex min-w-[140px] flex-1 gap-1.5" aria-hidden="true">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <span
                                key={n}
                                className={`h-1.5 flex-1 rounded-full ${n <= step ? "bg-purple" : "bg-charcoal/10"}`}
                              />
                            ))}
                          </div>
                        )}
                        <span className="ml-auto text-[11px] font-medium uppercase tracking-[.16em] text-charcoal/50 transition group-hover:text-purple">
                          Chi tiết →
                        </span>
                      </div>
                    </Link>

                    {canCancel && (
                      <div className="flex justify-end border-t border-charcoal/10 bg-lavender/20 px-6 py-3 sm:px-7">
                        <CancelOrderButton orderNumber={order.order_number} />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
