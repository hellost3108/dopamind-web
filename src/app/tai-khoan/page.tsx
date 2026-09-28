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

const iconProps = {
  viewBox: "0 0 24 24",
  width: 26,
  height: 26,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const cards = [
  {
    href: "/tai-khoan/ho-so",
    title: "Hồ sơ",
    desc: "Tên, số điện thoại và thông tin cá nhân của bạn.",
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
    desc: "Nơi nhận hàng, lưu sẵn để đặt nhanh hơn.",
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
    desc: "Theo dõi trạng thái và xem lại các đơn đã đặt.",
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
    desc: "Những sản phẩm bạn đã lưu lại để mua sau.",
    icon: (
      <svg {...iconProps}>
        <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z" />
      </svg>
    ),
  },
];

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
    <section className="px-[clamp(20px,4vw,64px)] pb-[clamp(56px,8vw,120px)] pt-[clamp(40px,6vw,96px)]">
      <div className="mx-auto max-w-5xl">
        {/* Đầu trang */}
        <div className="flex flex-col gap-6 border-b border-charcoal/10 pb-10 sm:flex-row sm:items-center sm:gap-8 sm:pb-14">
          <span
            aria-hidden
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-purple/10 font-serif text-3xl text-purple sm:h-24 sm:w-24 sm:text-4xl"
          >
            {initial}
          </span>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[.2em] text-charcoal/50">
              Tài khoản DOPAMIND
            </p>
            <h1 className="mt-2 font-serif text-4xl leading-tight text-charcoal sm:text-5xl">
              {fullName ? (
                <>
                  Xin chào, <span className="text-purple">{fullName}.</span>
                </>
              ) : (
                <>
                  Tài khoản <span className="text-purple">của tôi.</span>
                </>
              )}
            </h1>
            {user.email && (
              <p className="mt-2 break-all text-sm font-medium text-charcoal/60">{user.email}</p>
            )}
          </div>
        </div>

        {/* Các mục */}
        <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group flex min-h-44 flex-col justify-between rounded-2xl border border-charcoal/10 bg-white p-6 transition duration-300 hover:-translate-y-0.5 hover:border-purple/40 hover:shadow-[0_16px_36px_-20px_rgba(0,0,0,.3)] sm:p-7"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-purple/10 text-purple transition-colors duration-300 group-hover:bg-purple group-hover:text-white">
                {card.icon}
              </span>
              <div className="mt-8 flex items-end justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl text-charcoal">{card.title}</h2>
                  <p className="mt-1 text-sm font-medium text-charcoal/60">{card.desc}</p>
                </div>
                <span
                  aria-hidden
                  className="text-xl text-charcoal/40 transition duration-300 group-hover:translate-x-1 group-hover:text-purple"
                >
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Đăng xuất */}
        <div className="mt-10 flex justify-center sm:mt-14">
          <LogoutButton className="inline-flex min-h-11 items-center rounded-full border border-charcoal/20 px-8 text-xs font-medium uppercase tracking-[.13em] text-charcoal/70 transition-colors hover:border-charcoal hover:text-charcoal" />
        </div>
      </div>
    </section>
  );
}
