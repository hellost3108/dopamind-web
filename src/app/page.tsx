import { Hero } from "@/components/home/Hero";
import { QuickShop } from "@/components/home/QuickShop";
import { BestSellers } from "@/components/home/BestSellers";
import { DopaMindStory } from "@/components/home/DopaMindStory";
import { MindSkinStory } from "@/components/home/MindSkinStory";
import { MoodFinder } from "@/components/home/MoodFinder";
import { Collections } from "@/components/home/Collections";
import { Campaign } from "@/components/home/Campaign";
import { FeaturedReset } from "@/components/home/FeaturedReset";
import { Ritual } from "@/components/home/Ritual";
import { ResetTimer } from "@/components/home/ResetTimer";
import { NewArrivals } from "@/components/home/NewArrivals";
import { SkinScience } from "@/components/home/SkinScience";
import { DopamindMoments } from "@/components/home/DopamindMoments";
import { Playlist } from "@/components/home/Playlist";
import { Reviews } from "@/components/home/Reviews";
import { Manifesto } from "@/components/home/Manifesto";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Newsletter } from "@/components/home/Newsletter";

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
      <Ritual />
      <ResetTimer />
      <NewArrivals />
      <SkinScience />
      <DopamindMoments />
      <Playlist />
      <Reviews />
      <Manifesto />
      <FinalCTA />
      <Newsletter />
    </>
  );
}
