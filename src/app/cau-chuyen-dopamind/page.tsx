import type { Metadata } from "next";
import "./story.css";
import { BrandStoryHero } from "@/components/story/BrandStoryHero";
import { BrandMeaning } from "@/components/story/BrandMeaning";
import { BrandPillars } from "@/components/story/BrandPillars";
import { BrandOrigin } from "@/components/story/BrandOrigin";
import { BrandClosing } from "@/components/story/BrandClosing";
import { BrandStoryCTA } from "@/components/story/BrandStoryCTA";

export const metadata: Metadata = {
  title: "Câu chuyện DOPAMIND | DOPA + MIND + Mask Story",
  description:
    "Khám phá câu chuyện DOPAMIND — nơi DOPA, MIND và chăm sóc da gặp nhau trong một trải nghiệm Mind–Skin Care dành cho 15 phút của bạn.",
};

export default function StoryPage() {
  return (
    <>
      <BrandStoryHero />
      <BrandMeaning />
      <BrandPillars />
      <BrandOrigin />
      <BrandClosing />
      <BrandStoryCTA />
    </>
  );
}
