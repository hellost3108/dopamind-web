import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/pages/PageIntro";
import { AuthGate } from "@/components/account/AuthGate";
import { LogoutButton } from "@/components/account/LogoutButton";
import { getUser } from "@/lib/supabase/dal";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Tài khoản | DOPAMIND" };

function isSameSitePath(path: string | undefined): path is string {
  return !!path && path.startsWith("/") && !path.startsWith("//");
}

const iconBase = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const icons = {
  profile: (size: number, sw: number) => (
    <svg {...iconBase} width={size} height={size} strokeWidth={sw}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
    </svg>
  ),
  address: (size: number, sw: number) => (
    <svg {...iconBase} width={size} height={size} strokeWidth={sw}>
      <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  ),
  orders: (size: number, sw: number) => (
    <svg {...iconBase} width={size} height={size} strokeWidth={sw}>
      <path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z" />
      <path d="M3.5 7.5 12 12l8.5-4.5M12 12v9" />
    </svg>
  ),
  heart: (size: number, sw: number) => (
    <svg {...iconBase} width={size} height={size} strokeWidth={sw}>
      <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z" />
    </svg>
  ),
};

type Card = {
  href: string;
  title: string;
  desc: string;
  icon: (size: number, sw: number) => React.ReactNode;
  gradient: string;
  glow: string;
  span: string;
};

const cards: Card[] = [
  {
    href: "/tai-khoan/don-hang",
    title: "Đơn hàng",
    desc: "Xem lại và theo dõi các đơn bạn đã đặt.",
    icon: icons.orders,
    gradient: "from-orange-400 via-orange-500 to-rose-500",
    glow: "hover:shadow-[0_24px_50px_-20px_rgba(244,90,60,.7)]",
    span: "sm:col-span-2 lg:col-span-2",
  },
  {
    href: "/tai-khoan/ho-so",
    title: "Hồ sơ",
    desc: "Tên, số điện thoại, thông tin cá nhân.",
    icon: icons.profile,
    gradient: "from-violet-500 via-violet-600 to-purple-800",
    glow: "hover:shadow-[0_24px_50px_-20px_rgba(120,70,230,.7)]",
    span: "lg:col-span-1",
  },
  {
    href: "/tai-khoan/dia-chi",
    title: "Địa chỉ",
    desc: "Nơi nhận hàng, lưu sẵn để đặt nhanh.",
    icon: icons.address,
    gradient: "from-emerald-400 via-teal-500 to-cyan-600",
    glow: "hover:shadow-[0_24px_50px_-20px_rgba(20,170,150,.7)]",
    span: "lg:col-span-1",
  },
  {
    href: "/yeu-thich",
    title: "Yêu thích",
    desc: "Những sản phẩm bạn đã lưu lại để mua sau.",
    icon: icons.heart,
    gradient: "from-fuchsia-500 via-pink-500 to-rose-400",
    glow: "hover:shadow-[0_24px_50px_-20px_rgba(230,60,150,.7)]",
    span: "sm:col-span-2 lg:col-span-4",
  },
];

const styles = `
@keyframes dp-rise { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
@keyframes dp-float-a { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(34px,22px) scale(1.15); } }
@keyframes dp-float-b { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-30px,-22px) scale(1.12); } }
.dp-rise { animation: dp-rise .75s cubic-bezier(.2,.7,.2,1) both; animation-delay: var(--d, 0ms); }
.dp-blob-a { animation: dp-float-a 12s ease-in-out infinite; }
.dp-blob-b { animation: dp-float-b 15s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) {
  .dp-rise, .dp-blob-a, .dp-blob-b { animation: none; }
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
        <PageIntro
          eyebrow="Tài khoản DOPAMIND"
          title={
            <>
              Một nơi
              <br />
              <span className="text-purple">cho riêng bạn.</span>
            </>
          }
          body="Đăng nhập để lưu địa chỉ, theo dõi đơn hàng và giữ danh sách yêu thích của bạn ở mọi thiết bị."
        />
        <section className="px-[clamp(20px,4vw,64px)] py-[clamp(56px,8vw,120px)]">
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
      <style>{styles}</style>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {/* Ô chào */}
        <div
          className="dp-rise relative flex min-h-64 flex-col justify-between overflow-hidden rounded-3xl bg-charcoal p-6 text-cloud-milk sm:col-span-2 sm:p-8 lg:row-span-2"
          style={delay(0)}
        >
          <span aria-hidden className="dp-blob-a pointer-events-none absolute -right-12 -top-16 h-64 w-64 rounded-full bg-violet-500/40 blur-3xl" />
          <span aria-hidden className="dp-blob-b pointer-events-none absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-pink-500/30 blur-3xl" />

          <div className="relative flex items-start justify-between gap-4">
            <span
              aria-hidden
              className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-pink-400 font-serif text-2xl text-white ring-4 ring-white/10 sm:h-20 sm:w-20 sm:text-3xl"
            >
              {initial}
            </span>
            <LogoutButton className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/5 px-5 text-xs font-medium uppercase tracking-[.13em] text-cloud-milk/80 backdrop-blur transition-colors hover:border-white hover:text-white" />
          </div>

          <div className="relative mt-10">
            <p className="text-[11px] font-medium uppercase tracking-[.2em] text-cloud-milk/50">
              Tài khoản DOPAMIND
            </p>
            <h1 className="mt-2 font-serif text-4xl leading-tight sm:text-5xl">
              {fullName ? (
                <>
                  Chào,
                  <br />
                  <span className="bg-gradient-to-r from-violet-300 to-pink-300 bg-clip-text text-transparent">
                    {fullName}.
                  </span>
                </>
              ) : (
                <>
                  Tài khoản
                  <br />
                  <span className="bg-gradient-to-r from-violet-300 to-pink-300 bg-clip-text text-transparent">
                    của tôi.
                  </span>
                </>
              )}
            </h1>
            {user.email && (
              <p className="mt-3 break-all text-sm font-medium text-cloud-milk/60">{user.email}</p>
            )}
            <p className="mt-6 border-t border-white/10 pt-4 text-xs font-medium text-cloud-milk/50">
              Nghi thức 15 phút mỗi ngày, từ quá tải đến cân bằng.
            </p>
          </div>
        </div>

        {/* Các ô màu */}
        {cards.map((card, i) => (
          <Link
            key={card.href}
            href={card.href}
            style={delay(100 + i * 90)}
            className={`dp-rise group relative flex min-h-40 flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br ${card.gradient} p-5 text-white transition duration-300 hover:-translate-y-1 ${card.glow} sm:p-6 ${card.span}`}
          >
            {/* Biểu tượng lớn làm nền */}
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-6 -right-4 text-white/15 transition duration-500 group-hover:rotate-12 group-hover:scale-110"
            >
              {card.icon(140, 1.2)}
            </span>
            {/* Vệt sáng quét ngang khi rê chuột */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -translate-x-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/30 to-transparent transition duration-700 group-hover:translate-x-[400%]"
            />

            <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/20 backdrop-blur">
              {card.icon(22, 1.7)}
            </span>
            <div className="relative mt-6 flex items-end justify-between gap-3">
              <div>
                <h2 className="font-serif text-2xl">{card.title}</h2>
                <p className="mt-1 text-[13px] font-medium leading-snug text-white/80">{card.desc}</p>
              </div>
              <span
                aria-hidden
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-lg transition duration-300 group-hover:translate-x-1 group-hover:bg-white group-hover:text-charcoal"
              >
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
