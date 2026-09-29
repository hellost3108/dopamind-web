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
            <span className="italic text-purple">của bạn.</span>
          </>
        }
        body="Cập nhật thông tin cá nhân được dùng cho đơn hàng và liên hệ."
      />
      <section className="px-[clamp(20px,4vw,64px)] py-[clamp(56px,8vw,120px)]">
        <div className="mx-auto max-w-md">
          <Link
            href="/tai-khoan"
            className="mb-6 inline-flex min-h-11 items-center text-xs uppercase tracking-[.12em] text-charcoal/50 hover:text-charcoal"
          >
            ← TÀI KHOẢN
          </Link>
          <div className="rounded-lg bg-lavender/35 p-[clamp(28px,5vw,64px)]">
            <ProfileForm email={user.email ?? ""} fullName={profile?.full_name ?? ""} phone={profile?.phone ?? ""} />
          </div>
        </div>
      </section>
    </>
  );
}
