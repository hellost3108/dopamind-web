import type { Metadata } from "next";
import { StoryHero } from "@/components/story/StoryHero";
import { ChaosToCalm } from "@/components/story/ChaosToCalm";
import { MindSkinCare } from "@/components/story/MindSkinCare";
import { MaskRitualStory } from "@/components/story/MaskRitualStory";
import { FifteenMinutes } from "@/components/story/FifteenMinutes";
import { Beliefs } from "@/components/story/Beliefs";
import { StoryManifesto } from "@/components/story/StoryManifesto";
import { StoryCTA } from "@/components/story/StoryCTA";

export const metadata: Metadata = {
  title: "Câu chuyện DOPAMIND | Mind–Skin Care & Nghi Thức 15 Phút",
  description:
    "Khám phá câu chuyện DOPAMIND — nơi chăm sóc da trở thành một nghi thức 15 phút để bạn chậm lại, thở và dành một khoảng thời gian cho chính mình.",
};

export default function StoryPage() {
  return (
    <>
      <StoryHero />
      <ChaosToCalm />
      <MindSkinCare />
      <MaskRitualStory />
      <FifteenMinutes />
      <Beliefs />
      <StoryManifesto />
      <StoryCTA />
    </>
  );
}
