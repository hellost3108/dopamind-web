import Image from "next/image";
import Link from "next/link";
import { DesktopNav } from "@/components/layout/DesktopNav";
import { HeaderUtilities } from "@/components/layout/HeaderUtilities";
import { MobileNavTrigger } from "@/components/layout/MobileNav";
import { getMegaMenuCatalog, type MegaMenuCatalog } from "@/lib/real-products";

export async function Header() {
  // Mega menu phải là "best effort": nếu Supabase lỗi, Header vẫn phải
  // render đầy đủ — MegaMenu tự rơi về danh mục dạng chữ khi catalog rỗng.
  let catalog: MegaMenuCatalog | null = null;
  try {
    catalog = await getMegaMenuCatalog();
  } catch (error) {
    console.error("Lỗi tải danh mục cho mega menu:", error);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-charcoal/10 bg-cloud-milk/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-[clamp(20px,4vw,64px)] py-4">
        <Link
          href="/"
          aria-label="Trang chủ Dopamind Mask Story"
          className="relative block h-[29px] w-[112px] shrink-0 sm:h-[31px] sm:w-[120px] lg:h-[34px] lg:w-[130px] xl:h-[39px] xl:w-[150px]"
        >
          <Image
            src="/images/brand/dopamind-mask-story-logo-cropped.png"
            alt="Dopamind Mask Story"
            fill
            priority
            sizes="(min-width: 1181px) 150px, (min-width: 835px) 130px, (min-width: 431px) 120px, 112px"
            className="object-contain object-left"
          />
        </Link>

        <DesktopNav catalog={catalog} />

        <div className="flex items-center gap-1">
          <HeaderUtilities />
          <MobileNavTrigger />
        </div>
      </div>
    </header>
  );
}
