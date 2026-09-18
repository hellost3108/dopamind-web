import { Hero } from "@/components/home/Hero";
import { ProductFamilies } from "@/components/home/ProductFamilies";
import { HomeBrandStrip } from "@/components/home/HomeBrandStrip";
import { ScienceEmotionIntro } from "@/components/home/ScienceEmotionIntro";
import { SkinScience } from "@/components/home/SkinScience";
import { ResetTimer } from "@/components/home/ResetTimer";
import { JournalStories } from "@/components/home/JournalStories";
import { Newsletter } from "@/components/home/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <ProductFamilies />
      <HomeBrandStrip />
      <ScienceEmotionIntro />
      <SkinScience />
      <ResetTimer />
      <JournalStories />
      <Newsletter />
    </>
  );
}
