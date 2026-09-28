import type { Metadata } from "next";
import Link from "next/link";
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

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-sky-100 text-sky-800",
  processing: "bg-indigo-100 text-indigo-800",
  shipping: "bg-purple/10 text-purple",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-rose-100 text-rose-800",
  refunded: "bg-stone-200 text-stone-700",
};

// Bước tiến trình giao hàng (5 chặng)
const STEP: Record<string, number> = { pending: 1, confirmed: 2, processing: 3, shipping: 4, completed: 5 };

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
    <section className="px-[clamp(20px,4vw,64px)] pb-[clamp(56px,8vw,120px)] pt-[clamp(36px,5vw,72px)]">
      <div className="mx-auto max-w-4xl">
        {/* Điều hướng tài khoản */}
        <nav aria-label="Tài khoản" className="mb-10 flex flex-wrap gap-2">
          {ACCOUNT_NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={n.active ? "page" : undefined}
              className={`inline-flex min-h-10 items-center rounded-full border px-5 text-xs uppercase tracking-[.12em] transition ${
                n.active
                  ? "border-charcoal bg-charcoal text-white"
                  : "border-charcoal/15 text-charcoal/60 hover:border-charcoal/40 hover:text-charcoal"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Tiêu đề gọn */}
        <p className="text-xs uppercase tracking-[.16em] text-charcoal/45">Tài khoản DOPAMIND</p>
        <h1 className="mt-3 text-[clamp(34px,5vw,56px)] font-medium leading-[1.05] tracking-tight text-charcoal">
          Đơn hàng <span className="text-purple">của bạn.</span>
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-charcoal/55">
          Theo dõi trạng thái các đơn hàng đã đặt tại DOPAMIND.
        </p>

        {/* Thống kê nhanh */}
        {orders.length > 0 && (
          <dl className="mt-10 grid grid-cols-3 gap-3">
            {[
              { k: "Tổng đơn", v: String(orders.length) },
              { k: "Đang xử lý", v: String(inProgress) },
              { k: "Tổng giá trị", v: formatVnd(total) },
            ].map((s) => (
              <div key={s.k} className="rounded-2xl border border-charcoal/10 bg-white/60 p-4 sm:p-5">
                <dt className="text-[11px] uppercase tracking-[.12em] text-charcoal/45">{s.k}</dt>
                <dd className="mt-2 text-lg font-medium text-charcoal sm:text-2xl">{s.v}</dd>
              </div>
            ))}
          </dl>
        )}

        {/* Bộ lọc trạng thái */}
        <div className="mt-10 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Lọc theo trạng thái">
          {TABS.map((t) => (
            <Link
              key={t.key}
              href={t.key === "tat-ca" ? "/tai-khoan/don-hang" : `/tai-khoan/don-hang?trang-thai=${t.key}`}
              aria-current={t.key === tab.key ? "true" : undefined}
              className={`inline-flex min-h-10 shrink-0 items-center rounded-full border px-5 text-sm transition ${
                t.key === tab.key
                  ? "border-purple bg-purple text-white"
                  : "border-charcoal/15 bg-white/60 text-charcoal/70 hover:border-purple/50"
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>

        {/* Danh sách */}
        {shown.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-charcoal/15 bg-white/50 px-6 py-16 text-center">
            <p className="text-lg font-medium text-charcoal">
              {orders.length === 0 ? "Bạn chưa có đơn hàng nào" : "Không có đơn nào ở mục này"}
            </p>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-charcoal/55">
              {orders.length === 0
                ? "Khi bạn đặt hàng, đơn sẽ xuất hiện ở đây."
                : "Thử chọn một trạng thái khác để xem các đơn còn lại."}
            </p>
            <Link
              href={orders.length === 0 ? "/san-pham" : "/tai-khoan/don-hang"}
              className="mt-6 inline-flex min-h-11 items-center rounded-full bg-charcoal px-7 text-sm text-white transition hover:bg-purple"
            >
              {orders.length === 0 ? "Khám phá sản phẩm" : "Xem tất cả đơn"}
            </Link>
          </div>
        ) : (
          <ul className="mt-8 space-y-4">
            {shown.map((order) => {
              const step = STEP[order.status];
              return (
                <li key={order.id}>
                  <Link
                    href={`/tai-khoan/don-hang/${order.order_number}`}
                    className="group block rounded-2xl border border-charcoal/10 bg-white/70 p-5 transition hover:-translate-y-0.5 hover:border-purple/40 hover:shadow-[0_14px_34px_-18px_rgba(63,43,110,.4)] sm:p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium tracking-wide text-charcoal">{order.order_number}</p>
                        <p className="mt-1 text-xs text-charcoal/50">
                          Đặt ngày {new Date(order.created_at).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                      <p className="text-base font-medium text-charcoal sm:text-lg">{formatVnd(order.total_amount)}</p>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[.08em] ${
                          STATUS_STYLE[order.status] ?? "bg-stone-200 text-stone-700"
                        }`}
                      >
                        {STATUS_LABEL_VI[order.status] ?? order.status}
                      </span>
                      {step && (
                        <div className="flex min-w-[140px] flex-1 gap-1.5" aria-hidden="true">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <span key={n} className={`h-1 flex-1 rounded-full ${n <= step ? "bg-purple" : "bg-charcoal/10"}`} />
                          ))}
                        </div>
                      )}
                      <span className="ml-auto text-xs uppercase tracking-[.12em] text-charcoal/45 transition group-hover:text-purple">
                        Chi tiết →
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
