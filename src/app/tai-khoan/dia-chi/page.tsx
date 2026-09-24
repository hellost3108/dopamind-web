import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/pages/PageIntro";
import { AddressManager } from "@/components/account/AddressManager";
import { requireUser } from "@/lib/supabase/dal";
import { listMyAddresses } from "@/lib/supabase/addresses";

export const metadata: Metadata = { title: "Địa chỉ | DOPAMIND" };

export default async function AddressesPage() {
  await requireUser("/tai-khoan/dia-chi");
  const addresses = await listMyAddresses();

  return (
    <>
      <PageIntro
        eyebrow="Tài khoản DOPAMIND"
        title={
          <>
            Địa chỉ
            <br />
            <span className="text-purple">giao hàng.</span>
          </>
        }
        body="Lưu sẵn địa chỉ để đơn hàng tiếp theo của bạn nhanh hơn."
      />
      <section className="px-[clamp(20px,4vw,64px)] py-[clamp(56px,8vw,120px)]">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/tai-khoan"
            className="mb-10 inline-flex min-h-11 items-center text-xs uppercase tracking-[.12em] text-charcoal/50 hover:text-charcoal"
          >
            ← TÀI KHOẢN
          </Link>
          <AddressManager addresses={addresses} />
        </div>
      </section>
    </>
  );
}
