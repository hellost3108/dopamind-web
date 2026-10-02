import Link from "next/link";
import { getDashboard } from "@/lib/admin/data";
import {
  LOW_STOCK_THRESHOLD,
  ORDER_STATUS_LABEL,
  ORDER_STATUS_STYLE,
} from "@/lib/admin/labels";
import { formatDateTime } from "@/lib/admin/format";
import { formatVnd } from "@/lib/format";
import { PageHeader } from "@/components/admin/PageHeader";
import { card, chip } from "@/components/admin/ui";

export default async function AdminDashboardPage() {
  const d = await getDashboard();

  const stats = [
    { label: "Đơn chờ xử lý", value: String(d.pendingOrders), href: "/admin/don-hang?trang-thai=pending", tone: "bg-butter" },
    { label: "Sản phẩm đang bán", value: String(d.activeProducts), href: "/admin/san-pham", tone: "bg-mint" },
    { label: "Đơn 30 ngày qua", value: String(d.orders30d), href: "/admin/don-hang", tone: "bg-purple" },
    { label: "Doanh thu 30 ngày", value: formatVnd(d.revenue30d), href: "/admin/don-hang", tone: "bg-peach" },
  ];

  return (
    <div>
      <PageHeader title="Tổng quan" description="Tình hình cửa hàng DOPAMIND trong nháy mắt." />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className={`${card} !p-5 transition-colors hover:border-purple/50`}>
            <span aria-hidden="true" className={`block h-1.5 w-8 rounded-full ${s.tone}`} />
            <p className="mt-4 text-[13px] text-charcoal/60">{s.label}</p>
            <p className="mt-1 break-words font-serif text-2xl text-charcoal sm:text-3xl">{s.value}</p>
          </Link>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-charcoal/45">Doanh thu và số đơn không tính đơn đã hủy / đã hoàn tiền.</p>

      <Link href="/admin/noi-dung" className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-lavender/40 px-6 py-5 transition-colors hover:bg-lavender/60">
        <div>
          <h2 className="font-serif text-lg text-charcoal">Chỉnh sửa nội dung website</h2>
          <p className="mt-1 text-sm text-charcoal/60">Sửa chữ, nút bấm, chân trang, trang Nhật ký và Bài viết, không cần nhờ lập trình viên.</p>
        </div>
        <span className="inline-flex h-9 items-center rounded-xl bg-charcoal px-4 text-sm font-medium text-cloud-milk">Mở trang nội dung</span>
      </Link>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className={card}>
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-charcoal">Đơn hàng mới nhất</h2>
            <Link href="/admin/don-hang" className="text-xs text-purple underline-offset-4 hover:underline">
              Xem tất cả
            </Link>
          </div>
          {d.recentOrders.length === 0 ? (
            <p className="mt-6 text-sm text-charcoal/55">Chưa có đơn hàng nào.</p>
          ) : (
            <ul className="mt-4 divide-y divide-charcoal/10">
              {d.recentOrders.map((o) => (
                <li key={o.id}>
                  <Link href={`/admin/don-hang/${o.order_number}`} className="flex items-center justify-between gap-3 py-3 hover:opacity-70">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-charcoal">{o.order_number}</p>
                      <p className="truncate text-xs text-charcoal/55">
                        {o.recipient_name} · {formatDateTime(o.created_at)}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm text-charcoal">{formatVnd(Number(o.total_amount))}</p>
                      <span className={`${chip} ${ORDER_STATUS_STYLE[o.status] ?? ""}`}>
                        {ORDER_STATUS_LABEL[o.status] ?? o.status}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={card}>
          <h2 className="font-serif text-xl text-charcoal">Sắp hết hàng</h2>
          <p className="mt-1 text-xs text-charcoal/50">Biến thể đang bán còn từ {LOW_STOCK_THRESHOLD} sản phẩm trở xuống.</p>
          {d.lowStock.length === 0 ? (
            <p className="mt-6 text-sm text-charcoal/55">Tồn kho đang ổn.</p>
          ) : (
            <ul className="mt-4 divide-y divide-charcoal/10">
              {d.lowStock.map((v) => (
                <li key={v.id}>
                  <Link href={`/admin/san-pham/${v.productId}`} className="flex items-center justify-between gap-3 py-3 hover:opacity-70">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-charcoal">{v.productName}</p>
                      <p className="truncate text-xs text-charcoal/55">{v.variantName}</p>
                    </div>
                    <span className={`${chip} ${v.stock === 0 ? "bg-peach/60" : "bg-butter/60"} text-charcoal`}>
                      {v.stock === 0 ? "Hết hàng" : `Còn ${v.stock}`}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
