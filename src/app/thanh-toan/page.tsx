import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/pages/PageIntro";

export const metadata: Metadata = { title: "Thanh toán | DOPAMIND" };

/**
 * Honest holding page for the cart drawer's "THANH TOÁN" link (see
 * CLAUDE.md > COMMERCE and DOPAMIND_PHASE2 §25): no secure checkout RPC
 * exists yet (prices/variants/stock aren't verified end-to-end), so this
 * never pretends an order was placed. It exists only so that link resolves
 * to a real, honest state instead of a 404.
 */
export default function CheckoutPage() {
  return (
    <>
      <PageIntro
        eyebrow="Thanh toán"
        title={
          <>
            Thanh toán
            <br />
            <span className="text-purple">sắp mở.</span>
          </>
        }
        body="DOPAMIND đang hoàn thiện quy trình thanh toán an toàn. Giỏ hàng của bạn vẫn được giữ nguyên trên thiết bị này."
      />
      <section className="flex min-h-[40vh] items-center justify-center px-5 py-16">
        <Link
          href="/gio-hang"
          className="flex min-h-11 w-fit items-center border border-charcoal px-6 text-xs uppercase tracking-[.13em]"
        >
          QUAY LẠI GIỎ HÀNG
        </Link>
      </section>
    </>
  );
}
