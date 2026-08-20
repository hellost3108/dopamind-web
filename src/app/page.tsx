import { Hero } from "@/components/home/Hero";
import { QuickShop } from "@/components/home/QuickShop";
import { BestSellers } from "@/components/home/BestSellers";
import { DopaMindStory } from "@/components/home/DopaMindStory";
import { MindSkinStory } from "@/components/home/MindSkinStory";

export default function Home() {
  return (
    <>
      <Hero />
      <QuickShop />
      <BestSellers />
      <DopaMindStory />
      <MindSkinStory />
    </>
  );
}
