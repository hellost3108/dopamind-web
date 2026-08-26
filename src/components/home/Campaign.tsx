"use client";

import Link from "next/link";
import { getActiveCampaign } from "@/lib/campaigns";
import { CampaignMedia } from "@/components/home/CampaignMedia";
import { useReveal } from "@/hooks/use-reveal";
import { cn } from "@/lib/utils";

/**
 * Image-dominant campaign banner driven entirely by `getActiveCampaign()`
 * (src/lib/campaigns.ts) — nothing here is hard-coded, so a new campaign
 * (or none at all) only ever requires a data change. Renders nothing when
 * no campaign is active rather than falling back to placeholder copy. The
 * slow cinematic zoom on the media is the section's one primary motion —
 * the text gets a single, non-repeating reveal, nothing heavier.
 */
export function Campaign() {
  const campaign = getActiveCampaign();
  const [ref, isVisible] = useReveal<HTMLDivElement>();
  if (!campaign) return null;

  return (
    <section className="relative bg-cloud-milk py-[clamp(72px,10vh,144px)]">
      <div className="mx-auto max-w-[1600px] px-[clamp(20px,4vw,64px)]">
        <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[16/9] xl:aspect-[21/9]">
          <CampaignMedia className="h-full w-full" variant="campaign" />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(0deg, rgba(37,37,43,0.6) 0%, rgba(37,37,43,0.08) 42%, rgba(37,37,43,0) 60%)",
            }}
          />

          <div
            ref={ref}
            className={cn(
              "absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-10 xl:p-14",
              isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            )}
          >
            {campaign.eyebrowVi && (
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-cloud-milk/85">
                {campaign.eyebrowVi}
              </span>
            )}
            <h2 className="max-w-[24ch] text-[clamp(1.75rem,4.5vw,3.75rem)] font-medium leading-[1.08] tracking-[-0.01em] text-cloud-milk">
              {campaign.headlineVi}
            </h2>
            <p className="max-w-[32rem] text-[clamp(0.95rem,1.3vw,1.0625rem)] text-cloud-milk/85">
              {campaign.supportVi}
            </p>
            <Link
              href={campaign.ctaHref}
              className="mt-3 inline-flex min-h-11 w-fit items-center bg-cloud-milk px-6 text-xs font-medium tracking-[0.14em] text-charcoal transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-purple hover:text-cloud-milk"
            >
              {campaign.ctaLabelVi}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
