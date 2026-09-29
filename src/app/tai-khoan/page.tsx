import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { AuthGate, OrderLookup } from "@/components/account/AuthGate";
import { LogoutButton } from "@/components/account/LogoutButton";
import { getUser } from "@/lib/supabase/dal";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Tài khoản | DOPAMIND" };

function isSameSitePath(path: string | undefined): path is string {
  return !!path && path.startsWith("/") && !path.startsWith("//");
}

const iconProps = {
  viewBox: "0 0 24 24",
  width: 24,
  height: 24,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const cards = [
  {
    href: "/tai-khoan/ho-so",
    title: "Hồ sơ",
    desc: "Tên, số điện thoại, thông tin cá nhân.",
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
      </svg>
    ),
  },
  {
    href: "/tai-khoan/dia-chi",
    title: "Địa chỉ",
    desc: "Nơi nhận hàng, lưu sẵn để đặt nhanh.",
    icon: (
      <svg {...iconProps}>
        <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
        <circle cx="12" cy="9.5" r="2.5" />
      </svg>
    ),
  },
  {
    href: "/tai-khoan/don-hang",
    title: "Đơn hàng",
    desc: "Xem lại và theo dõi các đơn đã đặt.",
    icon: (
      <svg {...iconProps}>
        <path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z" />
        <path d="M3.5 7.5 12 12l8.5-4.5M12 12v9" />
      </svg>
    ),
  },
  {
    href: "/yeu-thich",
    title: "Yêu thích",
    desc: "Sản phẩm bạn đã lưu để mua sau.",
    icon: (
      <svg {...iconProps}>
        <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z" />
      </svg>
    ),
  },
];

const styles = `
@keyframes dp-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
@keyframes dp-float-a { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(30px,20px) scale(1.12); } }
@keyframes dp-float-b { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-26px,-18px) scale(1.1); } }
.dp-rise { animation: dp-rise .7s cubic-bezier(.2,.7,.2,1) both; animation-delay: var(--d, 0ms); }
.dp-blob-a { animation: dp-float-a 12s ease-in-out infinite; }
.dp-blob-b { animation: dp-float-b 14s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) {
  .dp-rise, .dp-blob-a, .dp-blob-b { animation: none; }
}
`;

/* Xanh than nhạt: đổi mã màu ở đây là cả 3 phần (thanh thông báo, header, footer) đổi theo. */
const NAVY = "#2A2D3D";

const auraStyles = `
header,
footer,
:has(+ header),
:has(+ div > header) {
  background: ${NAVY} !important;
  border-color: rgba(255,255,255,.14) !important;
}
header, header a, header button, header svg,
:has(+ header), :has(+ header) *,
:has(+ div > header), :has(+ div > header) > *:not(div),
footer, footer a, footer p, footer h2, footer h3, footer span, footer button {
  color: #FFFFFF !important;
}
header a[href="/"] img,
header img[alt*="opamind" i],
header img[src*="logo" i],
footer a[href="/"] img,
footer img[alt*="opamind" i],
footer img[src*="logo" i] {
  filter: brightness(0) invert(1);
}
`;

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const redirectParam = typeof params.redirect === "string" ? params.redirect : undefined;
  const redirectTo = isSameSitePath(redirectParam) ? redirectParam : "/tai-khoan";

  const user = await getUser();

  if (!user) {
    return (
      <>
        {/* Tiêu đề trang đăng nhập */}
        <section className="relative overflow-hidden border-b border-charcoal/10 px-[clamp(20px,4vw,64px)] pb-[clamp(40px,5vw,72px)] pt-[clamp(48px,6vw,88px)]">
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 h-72 w-[42rem] max-w-full -translate-x-1/2 rounded-full bg-lavender/40 blur-3xl"
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
              Một nơi
              <br />
              <span className="text-purple">cho riêng bạn.</span>
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-charcoal/60">
              Đăng nhập để lưu địa chỉ, theo dõi đơn hàng và giữ danh sách yêu thích của bạn ở mọi thiết bị.
            </p>
          </div>
        </section>

        <section className="px-[clamp(20px,4vw,64px)] py-[clamp(40px,6vw,88px)]">
          <AuthGate redirectTo={redirectTo} />
        </section>
      </>
    );
  }

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const fullName = profile?.full_name?.trim() || "";
  const initial = (fullName || user.email || "D").charAt(0).toUpperCase();

  return (
    <section className="px-[clamp(16px,4vw,64px)] pb-[clamp(40px,6vw,80px)] pt-[clamp(20px,3vw,48px)]">
      <style>{styles + auraStyles}</style>
      <div className="mx-auto grid max-w-6xl gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {/* Ô chào */}
        <div
          className="dp-rise relative overflow-hidden rounded-3xl border border-charcoal/10 bg-gradient-to-br from-purple/15 via-white to-white p-6 sm:col-span-2 sm:p-8 lg:col-span-4"
          style={delay(0)}
        >
          <span aria-hidden className="dp-blob-a pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-purple/25 blur-3xl" />
          <span aria-hidden className="dp-blob-b pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-purple/15 blur-3xl" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <span
                aria-hidden
                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-purple font-serif text-2xl text-white shadow-[0_10px_30px_-10px_rgba(120,80,220,.7)] sm:h-20 sm:w-20 sm:text-3xl"
              >
                {initial}
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-[.2em] text-charcoal/50">
                  Tài khoản DOPAMIND
                </p>
                <h1 className="mt-1 font-serif text-3xl leading-tight text-charcoal sm:text-4xl">
                  {fullName ? (
                    <>
                      Chào, <span className="text-purple">{fullName}.</span>
                    </>
                  ) : (
                    <>
                      Tài khoản <span className="text-purple">của tôi.</span>
                    </>
                  )}
                </h1>
                {user.email && (
                  <p className="mt-1 break-all text-sm font-medium text-charcoal/60">{user.email}</p>
                )}
              </div>
            </div>
            <LogoutButton className="inline-flex min-h-11 shrink-0 items-center justify-center self-start rounded-full border border-charcoal/20 bg-white/60 px-6 text-xs font-medium uppercase tracking-[.13em] text-charcoal/70 backdrop-blur transition-colors hover:border-charcoal hover:text-charcoal sm:self-auto" />
          </div>
        </div>

        {/* 4 thẻ chức năng */}
        {cards.map((card, i) => (
          <Link
            key={card.href}
            href={card.href}
            style={delay(100 + i * 80)}
            className="dp-rise group relative flex min-h-40 flex-col justify-between overflow-hidden rounded-3xl border border-charcoal/10 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-purple/40 hover:shadow-[0_18px_40px_-22px_rgba(90,50,200,.5)] sm:p-6"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-purple/0 blur-2xl transition duration-500 group-hover:bg-purple/25"
            />
            <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-purple/10 text-purple transition-colors duration-300 group-hover:bg-purple group-hover:text-white">
              {card.icon}
            </span>
            <div className="relative mt-6 flex items-end justify-between gap-3">
              <div>
                <h2 className="font-serif text-xl text-charcoal">{card.title}</h2>
                <p className="mt-1 text-[13px] font-medium leading-snug text-charcoal/60">{card.desc}</p>
              </div>
              <span
                aria-hidden
                className="text-lg text-charcoal/30 transition duration-300 group-hover:translate-x-1 group-hover:text-purple"
              >
                →
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Tra cứu đơn hàng theo mã đơn + số điện thoại */}
      <div className="mx-auto mt-3 max-w-6xl sm:mt-4">
        <OrderLookup />
      </div>
    </section>
  );
}
