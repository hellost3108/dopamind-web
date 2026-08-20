import Link from "next/link";
import { PRIMARY_NAV, SHOP_NAV_LABEL } from "@/lib/navigation";
import { MegaMenu } from "@/components/layout/MegaMenu";

export function DesktopNav() {
  return (
    <nav
      aria-label="Điều hướng chính"
      className="hidden items-center gap-x-[clamp(0.75rem,1.6vw,2.25rem)] xl:flex"
    >
      {PRIMARY_NAV.map((item) =>
        item.labelVi === SHOP_NAV_LABEL ? (
          <MegaMenu key={item.href} />
        ) : (
          <Link
            key={item.href}
            href={item.href}
            className="whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.14em] text-charcoal transition-colors hover:text-purple xl:text-xs"
          >
            {item.labelVi}
          </Link>
        )
      )}
    </nav>
  );
}
