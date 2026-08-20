import type { Campaign } from "@/lib/types";

/**
 * SAMPLE / PLACEHOLDER CAMPAIGN
 * ----------------------------
 * Configurable campaign slot — `getActiveCampaign()` is what the homepage
 * section reads, and it renders nothing when no campaign is active instead
 * of a hard-coded banner. No discount/price fields exist on `Campaign` on
 * purpose, see CLAUDE.md > COMMERCE ("Do NOT hard-code discounts"). The CTA
 * route matches the existing mega-menu campaign placeholder
 * (src/lib/mega-menu.ts) so nav and homepage stay in sync. Replace/extend
 * this array with real campaign data before launch.
 */
export const CAMPAIGNS: Campaign[] = [
  {
    id: "c1",
    slug: "15-phut-cho-rieng-minh",
    active: true,
    eyebrowVi: "NGHI THỨC",
    headlineVi: "15 PHÚT CHO RIÊNG MÌNH",
    supportVi: "Một nghi thức nhỏ để khép lại ngày dài.",
    ctaLabelVi: "KHÁM PHÁ NGHI THỨC →",
    ctaHref: "/nghi-thuc-15-phut",
    moodAccent: "tai-tao",
    isPlaceholder: true,
  },
];

/**
 * Returns the first campaign that is switched on and inside its date
 * window (when one is set). Callers should render nothing when this
 * returns undefined rather than falling back to placeholder copy.
 */
export function getActiveCampaign(now: Date = new Date()): Campaign | undefined {
  return CAMPAIGNS.find((campaign) => {
    if (!campaign.active) return false;
    if (campaign.startDate && now < new Date(campaign.startDate)) return false;
    if (campaign.endDate && now > new Date(campaign.endDate)) return false;
    return true;
  });
}
