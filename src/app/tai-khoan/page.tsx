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

const dashboardLink =
  "flex min-h-11 items-center justify-between border-b border-charcoal/10 py-4 text-sm font-medium uppercase tracking-[.1em] text-charcoal transition-colors hover:text-purple";

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

  return (
    <>
      <PageIntro
        eyebrow="Tài khoản DOPAMIND"
        title={
          <>
            {profile?.full_name ? (
              <>
                Chào,
                <br />
                <span className="text-purple">{profile.full_name}.</span>
              </>
            ) : (
              <>
                Tài khoản
                <br />
                <span className="text-purple">của tôi.</span>
              </>
            )}
          </>
        }
        body={user.email ?? ""}
      />
      <section className="px-[clamp(20px,4vw,64px)] py-[clamp(56px,8vw,120px)]">
        <div className="mx-auto max-w-2xl">
          <Link href="/tai-khoan/ho-so" className={dashboardLink}>
            HỒ SƠ <span aria-hidden>→</span>
          </Link>
          <Link href="/tai-khoan/dia-chi" className={dashboardLink}>
            ĐỊA CHỈ <span aria-hidden>→</span>
          </Link>
          <Link href="/tai-khoan/don-hang" className={dashboardLink}>
            ĐƠN HÀNG <span aria-hidden>→</span>
          </Link>
          <Link href="/yeu-thich" className={dashboardLink}>
            YÊU THÍCH <span aria-hidden>→</span>
          </Link>
          <LogoutButton className={`${dashboardLink} w-full text-left text-charcoal/60`} />
        </div>
      </section>
    </>
  );
}
