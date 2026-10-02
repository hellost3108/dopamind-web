import Link from "next/link";
import { getAdminOrders } from "@/lib/admin/data";
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABEL,
  ORDER_STATUS_STYLE,
  PAYMENT_STATUS_LABEL,
  PAYMENT_STATUS_STYLE,
} from "@/lib/admin/labels";
import { formatDateTime } from "@/lib/admin/format";
import { formatVnd } from "@/lib/format";
import { btnPrimary, card, chip, inputCls } from "@/components/admin/ui";

function one(v: string | string[] | undefined): string {
  return (Array.isArray(v) ? v[0] : v) ?? "";
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const rawStatus = one(sp["trang-thai"]);
  const status = (ORDER_STATUSES as readonly string[]).includes(rawStatus) ? rawStatus : "";
  const q = one(sp.q).trim();

  const orders = await getAdminOrders({ status: status || undefined, q });

  const tabHref = (s: string) => {
    const params = new URLSearchParams();
    if (s) params.set("trang-thai", s);
    if (q) params.set("q", q);
    const qs = params.toString();
    return `/admin/don-hang${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-serif text-3xl text-charcoal sm:text-4xl">Đơn hàng</h1>
      <p className="mt-2 text-sm text-charcoal/60">Hiển thị tối đa 200 đơn mới nhất theo bộ lọc.</p>

      <form action="/admin/don-hang" className="mt-6 flex flex-wrap gap-3">
        {status && <input type="hidden" name="trang-thai" value={status} />}
        <input
          name="q"
          defaultValue={q}
          placeholder="Tìm theo mã đơn, tên, số điện thoại, email..."
          className={inputCls + " max-w-md flex-1"}
        />
        <button type="submit" className={btnPrimary}>Tìm</button>
      </form>

      <div className="mt-5 flex flex-wrap gap-2">
        {[{ key: "", label: "Tất cả" }, ...ORDER_STATUSES.map((s) => ({ key: s, label: ORDER_STATUS_LABEL[s] }))].map((t) => (
          <Link
            key={t.key || "all"}
            href={tabHref(t.key)}
            aria-current={status === t.key ? "page" : undefined}
            className={`rounded-full border px-4 py-1.5 text-[13px] transition-colors ${
              status === t.key
                ? "border-charcoal bg-charcoal text-cloud-milk"
                : "border-charcoal/15 bg-white text-charcoal hover:bg-lavender/30"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <div className={`${card} mt-6 !p-0`}>
        {orders.length === 0 ? (
          <p className="p-8 text-center text-sm text-charcoal/55">Không có đơn hàng nào phù hợp.</p>
        ) : (
          <ul className="divide-y divide-charcoal/10">
            {orders.map((o) => (
              <li key={o.id}>
                <Link href={`/admin/don-hang/${o.order_number}`} className="flex flex-wrap items-center justify-between gap-3 p-4 transition-colors hover:bg-lavender/20 sm:p-5">
                  <div className="min-w-0">
                    <p className="text-[15px] font-medium text-charcoal">{o.order_number}</p>
                    <p className="mt-0.5 text-xs text-charcoal/55">
                      {o.recipient_name} · {o.phone} · {formatDateTime(o.created_at)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`${chip} ${PAYMENT_STATUS_STYLE[o.payment_status] ?? ""}`}>
                      {PAYMENT_STATUS_LABEL[o.payment_status] ?? o.payment_status}
                    </span>
                    <span className={`${chip} ${ORDER_STATUS_STYLE[o.status] ?? ""}`}>
                      {ORDER_STATUS_LABEL[o.status] ?? o.status}
                    </span>
                    <span className="min-w-[96px] text-right text-sm font-medium text-charcoal">
                      {formatVnd(Number(o.total_amount))}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
