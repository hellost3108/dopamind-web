import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/pages/PageIntro";
import { ProfileForm } from "@/components/account/ProfileForm";
import { requireUser } from "@/lib/supabase/dal";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Hồ sơ | DOPAMIND" };

export default async function ProfilePage() {
  const user = await requireUser("/tai-khoan/ho-so");
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <>
      <PageIntro
        eyebrow="Tài khoản DOPAMIND"
        title={
          <>
            Hồ sơ
            <br />
            <span className="text-purple">của bạn.</span>
          </>
        }
        body="Cập nhật thông tin cá nhân được dùng cho đơn hàng và liên hệ."
      />
      <section className="px-[clamp(20px,4vw,64px)] py-[clamp(56px,8vw,120px)]">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/tai-khoan"
            className="mb-10 inline-flex min-h-11 items-center text-xs uppercase tracking-[.12em] text-charcoal/50 hover:text-charcoal"
          >
            ← TÀI KHOẢN
          </Link>
          <ProfileForm email={user.email ?? ""} fullName={profile?.full_name ?? ""} phone={profile?.phone ?? ""} />
        </div>
      </section>
    </>
  );
}
