import { Hero } from "@/components/home/Hero";
import { QuickShop } from "@/components/home/QuickShop";
import { BestSellers } from "@/components/home/BestSellers";
import { DopaMindStory } from "@/components/home/DopaMindStory";
import { MindSkinStory } from "@/components/home/MindSkinStory";
import { MoodFinder } from "@/components/home/MoodFinder";
import { Collections } from "@/components/home/Collections";
import { Campaign } from "@/components/home/Campaign";
import { FeaturedReset } from "@/components/home/FeaturedReset";

export default function Home() {
  return (
    <>
      <Hero />
      <QuickShop />
      <BestSellers />
      <DopaMindStory />
      <MindSkinStory />
      <MoodFinder />
      <Collections />
      <Campaign />
      <FeaturedReset />
    </>
  );
}
