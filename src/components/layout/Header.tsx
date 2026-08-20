import Link from "next/link";
import { DesktopNav } from "@/components/layout/DesktopNav";
import { HeaderUtilities } from "@/components/layout/HeaderUtilities";
import { MobileNavTrigger } from "@/components/layout/MobileNav";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-charcoal/10 bg-cloud-milk/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-[clamp(20px,4vw,64px)] py-4">
        <Link
          href="/"
          className="whitespace-nowrap text-lg font-semibold tracking-[0.08em] text-charcoal"
        >
          DOPAMIND
        </Link>

        <DesktopNav />

        <div className="flex items-center gap-1">
          <HeaderUtilities />
          <MobileNavTrigger />
        </div>
      </div>
    </header>
  );
}
