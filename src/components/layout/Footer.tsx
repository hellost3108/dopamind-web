import Link from "next/link";
import { FOOTER_GROUPS, SOCIAL_LINKS, LEGAL_LINKS } from "@/lib/footer";

const GROUP_TITLE = "text-[11px] font-medium uppercase tracking-[0.18em] text-charcoal/45";
const GROUP_LINK =
  "flex min-h-11 items-center text-sm text-charcoal/70 transition-colors hover:text-charcoal sm:min-h-0 sm:py-1";

/**
 * Desktop/tablet render every group open, always visible. Mobile swaps to
 * native <details>/<summary> accordions — zero JS, fully accessible, no
 * hydration cost — per CLAUDE.md > FOOTER ("mobile accordion or stacked
 * groups"). Only real, already-verified DOPAMIND brand copy appears here;
 * no business registration/address is invented — see CLAUDE.md > FOOTER
 * ("Do not invent registration information.").
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-charcoal/10 bg-cloud-milk">
      <div className="mx-auto max-w-[1600px] px-[clamp(20px,4vw,64px)] py-[clamp(56px,8vh,96px)]">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16 xl:gap-20">
          <div className="max-w-[22rem]">
            <span className="text-lg font-semibold tracking-[0.08em] text-charcoal">
              DOPAMIND
            </span>
            <p className="mt-3 text-sm leading-relaxed text-charcoal/60">
              Mind–Skin Care. Nghi thức 15 phút mỗi ngày, từ quá tải đến cân bằng.
            </p>
          </div>

          {/* Mobile: accordion, one group open at a time by the user */}
          <div className="flex flex-col divide-y divide-charcoal/10 md:hidden">
            {FOOTER_GROUPS.map((group) => (
              <details key={group.titleVi} className="group py-1">
                <summary className={`flex cursor-pointer list-none items-center justify-between py-3 ${GROUP_TITLE}`}>
                  {group.titleVi}
                  <span aria-hidden className="text-charcoal/40 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <ul className="flex flex-col pb-3">
                  {group.links.map((link) => (
                    <li key={link.href + link.labelVi}>
                      <Link href={link.href} className={GROUP_LINK}>
                        {link.labelVi}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
            <details className="group py-1">
              <summary className={`flex cursor-pointer list-none items-center justify-between py-3 ${GROUP_TITLE}`}>
                KẾT NỐI
                <span aria-hidden className="text-charcoal/40 transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <ul className="flex flex-col pb-3">
                {SOCIAL_LINKS.map((link) => (
                  <li key={link.labelVi}>
                    <Link href={link.href} className={GROUP_LINK}>
                      {link.labelVi}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          </div>

          {/* Tablet + Desktop: adaptive grid, all groups always expanded */}
          <div className="hidden grid-cols-3 gap-x-6 gap-y-10 md:grid lg:grid-cols-5 lg:gap-x-8">
            {FOOTER_GROUPS.map((group) => (
              <div key={group.titleVi} className="flex flex-col gap-3">
                <span className={GROUP_TITLE}>{group.titleVi}</span>
                <ul className="flex flex-col gap-1.5">
                  {group.links.map((link) => (
                    <li key={link.href + link.labelVi}>
                      <Link href={link.href} className={GROUP_LINK}>
                        {link.labelVi}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="flex flex-col gap-3">
              <span className={GROUP_TITLE}>KẾT NỐI</span>
              <ul className="flex flex-col gap-1.5">
                {SOCIAL_LINKS.map((link) => (
                  <li key={link.labelVi}>
                    <Link href={link.href} className={GROUP_LINK}>
                      {link.labelVi}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-charcoal/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-charcoal/45">
            © {year} DOPAMIND. Tất cả các quyền được bảo lưu.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[11px] font-medium tracking-[0.1em] text-charcoal/50 underline underline-offset-4 transition-colors hover:text-charcoal"
                >
                  {link.labelVi}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
