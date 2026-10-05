import { Hero } from "@/components/home/Hero";
import { ProductFamilies } from "@/components/home/ProductFamilies";
import { HomeBrandStrip } from "@/components/home/HomeBrandStrip";
import { ScienceEmotionIntro } from "@/components/home/ScienceEmotionIntro";
import { SkinScience } from "@/components/home/SkinScience";
import { ResetTimer } from "@/components/home/ResetTimer";
import { JournalStories } from "@/components/home/JournalStories";
import { Newsletter } from "@/components/home/Newsletter";
import { getSection } from "@/lib/cms/server";

export default async function Home() {
  const [scienceEmotion, skinScience, ritual, newsletter] = await Promise.all([
    getSection("home.scienceEmotion"),
    getSection("home.skinScience"),
    getSection("home.ritual"),
    getSection("home.newsletter"),
  ]);

  return (
    <>
      <Hero />
      <ProductFamilies />
      <HomeBrandStrip />
      <ScienceEmotionIntro content={scienceEmotion} />
      <SkinScience content={skinScience} />
      <ResetTimer content={ritual} />
      <JournalStories />
      <Newsletter content={newsletter} />
    </>
  );
}
