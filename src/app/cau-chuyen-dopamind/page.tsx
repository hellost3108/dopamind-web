import type { Metadata } from "next";
import "./story.css";
import { BrandStoryHero } from "@/components/story/BrandStoryHero";
import { BrandMeaning } from "@/components/story/BrandMeaning";
import { BrandPillars } from "@/components/story/BrandPillars";
import { BrandOrigin } from "@/components/story/BrandOrigin";
import { BrandClosing } from "@/components/story/BrandClosing";
import { BrandStoryCTA } from "@/components/story/BrandStoryCTA";
import { getSection } from "@/lib/cms/server";
import { bool } from "@/lib/cms/fields";

export const metadata: Metadata = {
  title: "Câu chuyện DOPAMIND | DOPA + MIND + Mask Story",
  description:
    "Khám phá câu chuyện DOPAMIND — nơi DOPA, MIND và chăm sóc da gặp nhau trong một trải nghiệm Mind–Skin Care dành cho 15 phút của bạn.",
};

export default async function StoryPage() {
  const [hero, meaning, pillars, origin, closing, cta] = await Promise.all([
    getSection("story.hero"),
    getSection("story.meaning"),
    getSection("story.pillars"),
    getSection("story.origin"),
    getSection("story.closing"),
    getSection("story.cta"),
  ]);

  return (
    <>
      {bool(hero, "enabled") && <BrandStoryHero content={hero} />}
      {bool(meaning, "enabled") && <BrandMeaning content={meaning} />}
      {bool(pillars, "enabled") && <BrandPillars content={pillars} />}
      {bool(origin, "enabled") && <BrandOrigin content={origin} />}
      {bool(closing, "enabled") && <BrandClosing content={closing} />}
      {bool(cta, "enabled") && <BrandStoryCTA content={cta} />}
    </>
  );
}
