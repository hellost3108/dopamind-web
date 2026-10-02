import type { Metadata } from "next";
import Link from "next/link";
import { ProfileForm } from "@/components/account/ProfileForm";
import { requireUser } from "@/lib/supabase/dal";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Hồ sơ | DOPAMIND" };

const coverStyle = {
  backgroundColor: "#D8D2FF",
  backgroundImage:
    "radial-gradient(circle at 20% 20%, #FFC8B8, transparent 55%), radial-gradient(circle at 85% 30%, #F6E5A6, transparent 50%), radial-gradient(circle at 50% 100%, #CFE9DF, transparent 60%)",
};

const cardTitle =
  "font-serif text-[clamp(1.6rem,3vw,2.1rem)] font-medium leading-tight text-charcoal";

export default async function ProfilePage() {
  const user = await requireUser("/tai-khoan/ho-so");
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone")
    .eq("id", user.id)
    .maybeSingle();

  const fullName = profile?.full_name?.trim() || "";
  const initial = (fullName || user.email || "D").charAt(0).toUpperCase();

  return (
    <>
      {/* Tiêu đề: cùng kiểu với trang /tai-khoan */}
      <section className="relative overflow-hidden px-[clamp(20px,4vw,64px)] pb-[clamp(110px,12vw,170px)] pt-[clamp(48px,6vw,88px)]">
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-80 w-[46rem] max-w-full -translate-x-1/2 rounded-full bg-lavender/50 blur-3xl"
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

      {/* Một thẻ duy nhất: đầu thẻ là hồ sơ, bên dưới chia 2 cột */}
      <section className="relative px-[clamp(16px,4vw,64px)] pb-[clamp(56px,8vw,110px)]">
        <div className="mx-auto -mt-[clamp(70px,8vw,110px)] max-w-6xl overflow-hidden rounded-[28px] border border-charcoal/10 bg-white">
          {/* Đầu thẻ: ảnh bìa + avatar + tên */}
          <div className="h-36 sm:h-44" style={coverStyle} />
          <div className="px-6 pb-9 text-center">
            <span
              aria-hidden
              className="-mt-12 mx-auto flex h-24 w-24 items-center justify-center rounded-full border-[5px] border-cloud-milk bg-charcoal font-serif text-4xl text-cloud-milk"
            >
              {initial}
            </span>
            <h2 className="mt-3 font-serif text-[clamp(1.75rem,3vw,2.25rem)] font-semibold leading-tight text-charcoal">
              {fullName || "Thành viên DOPAMIND"}
            </h2>
            {user.email && <p className="mt-1 break-all text-[13px] text-charcoal/55">{user.email}</p>}
            <span className="mt-4 inline-block rounded-full bg-mint px-4 py-1.5 text-[11px] font-medium uppercase tracking-[.14em] text-charcoal">
              Thành viên DOPAMIND
            </span>
          </div>

          {/* Thân thẻ: trái = thông tin cá nhân, phải = sổ địa chỉ */}
          <div className="grid border-t border-charcoal/10 lg:grid-cols-2 lg:divide-x lg:divide-charcoal/10">
            <div className="bg-white p-[clamp(24px,4vw,44px)]">
              <div className="mb-8">
                <h2 className={cardTitle}>Thông tin cá nhân</h2>
                <p className="mt-2 text-[13.5px] text-charcoal/55">
                  Thông tin này giúp chúng tôi giao hàng đúng người, đúng nơi.
                </p>
              </div>
              <ProfileForm email={user.email ?? ""} fullName={profile?.full_name ?? ""} phone={profile?.phone ?? ""} />
            </div>

            <div className="flex flex-col border-t border-charcoal/10 bg-lavender/30 p-[clamp(24px,4vw,44px)] lg:border-t-0">
              <div className="mb-8">
                <h2 className={cardTitle}>Sổ địa chỉ</h2>
                <p className="mt-2 text-[13.5px] text-charcoal/55">
                  Lưu sẵn địa chỉ để thanh toán nhanh hơn ở lần sau.
                </p>
              </div>
              <div className="flex flex-1 flex-col items-center justify-center rounded-[20px] border border-dashed border-charcoal/15 px-6 py-12 text-center">
                <p className="mb-5 text-sm text-charcoal/60">Quản lý nơi nhận hàng của bạn.</p>
                <Link
                  href="/tai-khoan/dia-chi"
                  className="inline-flex h-[52px] items-center justify-center rounded-full border border-charcoal px-8 text-xs font-medium uppercase tracking-[.18em] text-charcoal transition-colors hover:bg-charcoal hover:text-cloud-milk"
                >
                  Quản lý địa chỉ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
