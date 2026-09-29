import type { Metadata } from "next";
import Link from "next/link";
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
      {/* Tiêu đề: cùng kiểu với trang /tai-khoan */}
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
            Hồ sơ
            <br />
            <span className="text-purple">của bạn.</span>
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-charcoal/60">
            Cập nhật thông tin cá nhân được dùng cho đơn hàng và liên hệ.
          </p>
        </div>
      </section>

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
