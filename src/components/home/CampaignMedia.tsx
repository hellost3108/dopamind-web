import Image from "next/image";
import { cn } from "@/lib/utils";

export type CampaignMediaVariant = "hero" | "campaign";

const HERO_ALT = "Khoảnh khắc thư giãn trong nghi thức chăm sóc da Dopamind Mask Story";
const CAMPAIGN_ALT = "Bộ mặt nạ MTS của Dopamind Mask Story trong không gian nghi thức chăm sóc da";

/**
 * Shared media panel for Hero and Campaign — same cinematic-zoom + overlay
 * treatment, different source photography per `variant` so the two sections
 * never accidentally show the same image. Each variant art-directs its own
 * breakpoints (Hero: mobile/tablet vs xl+; Campaign: mobile/tablet/desktop)
 * as stacked `next/image` layers toggled by Tailwind visibility classes,
 * matching the aspect-ratio breakpoints already set by the calling section.
 */
export function CampaignMedia({
  className,
  variant,
}: {
  className?: string;
  variant: CampaignMediaVariant;
}) {
  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      <div className="absolute inset-0 animate-cinematic-zoom">
        {variant === "hero" ? (
          <>
            <Image
              src="/images/homepage/hero/H02.png"
              alt={HERO_ALT}
              fill
              priority
              sizes="100vw"
              className="object-cover xl:hidden"
              style={{ objectPosition: "72% 15%" }}
            />
            <Image
              src="/images/homepage/hero/H01.png"
              alt={HERO_ALT}
              fill
              priority
              sizes="(min-width: 1600px) 54vw, (min-width: 1181px) 58vw, 100vw"
              className="hidden object-cover xl:block"
              style={{ objectPosition: "78% 25%" }}
            />
          </>
        ) : (
          <>
            <Image
              src="/images/homepage/campaign/CB03.png"
              alt={CAMPAIGN_ALT}
              fill
              sizes="100vw"
              className="object-cover sm:hidden"
              style={{ objectPosition: "70% 20%" }}
            />
            <Image
              src="/images/homepage/campaign/CB02.png"
              alt={CAMPAIGN_ALT}
              fill
              sizes="100vw"
              className="hidden object-cover sm:block xl:hidden"
              style={{ objectPosition: "72% 30%" }}
            />
            <Image
              src="/images/homepage/campaign/CB01.png"
              alt={CAMPAIGN_ALT}
              fill
              sizes="100vw"
              className="hidden object-cover xl:block"
              style={{ objectPosition: "68% 35%" }}
            />
          </>
        )}
      </div>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(120% 90% at 75% 18%, rgba(248,247,243,0) 0%, rgba(248,247,243,0.32) 100%)",
        }}
      />
    </div>
  );
}
