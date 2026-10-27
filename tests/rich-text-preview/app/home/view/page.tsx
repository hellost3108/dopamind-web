import { Hero } from "@/components/home/Hero";
import { ProductFamilies } from "@/components/home/ProductFamilies";
import { HomeBrandStrip } from "@/components/home/HomeBrandStrip";
import { ScienceEmotionIntro } from "@/components/home/ScienceEmotionIntro";
import { SkinScience } from "@/components/home/SkinScience";
import { ResetTimer } from "@/components/home/ResetTimer";
import { JournalStories } from "@/components/home/JournalStories";
import { Newsletter } from "@/components/home/Newsletter";
import { getSectionDef } from "@/lib/cms/sections";
import { validateContent } from "@/lib/cms/fields";

export default async function HomeView({searchParams}:{searchParams:Promise<{section?:string;content?:string}>}) {
  const params = await searchParams;
  const def = getSectionDef(params.section ?? "");
  if (!def || def.group !== "home" || !params.content || params.content.length > 200_000) return <p>Dữ liệu bản thử không hợp lệ.</p>;
  let raw: unknown;
  try { raw = JSON.parse(params.content); } catch { return <p>Dữ liệu bản thử không hợp lệ.</p>; }
  const checked = validateContent(def, raw);
  if (!checked.ok) return <p>{checked.error}</p>;
  const content = checked.value;
  const nodes = {
    "home.hero": <Hero content={content} />,
    "home.productFamilies": <ProductFamilies content={content} />,
    "home.brandStrip": <HomeBrandStrip content={content} />,
    "home.scienceEmotion": <ScienceEmotionIntro content={content} />,
    "home.skinScience": <SkinScience content={content} />,
    "home.ritual": <ResetTimer content={content} />,
    "home.journal": <JournalStories content={content} />,
    "home.newsletter": <Newsletter content={content} />,
  };
  return <main data-testid="home-component">{nodes[def.key as keyof typeof nodes]}</main>;
}
