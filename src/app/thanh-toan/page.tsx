import type { Metadata } from "next";
import { getUser } from "@/lib/supabase/dal";
import { listMyAddresses } from "@/lib/supabase/addresses";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = { title: "Thanh toán | DOPAMIND" };

export default async function ThanhToanPage() {
  const user = await getUser();
  const addresses = user ? await listMyAddresses() : [];

  return (
    <section className="px-[clamp(20px,4vw,64px)] py-[clamp(56px,8vw,120px)]">
      <div className="mx-auto max-w-6xl">
        <CheckoutForm addresses={addresses} isLoggedIn={!!user} />
      </div>
    </section>
  );
}
