import { BrandStoryHero } from "@/components/story/BrandStoryHero";
import { BrandMeaning } from "@/components/story/BrandMeaning";
import { BrandPillars } from "@/components/story/BrandPillars";
import { BrandOrigin } from "@/components/story/BrandOrigin";
import { BrandClosing } from "@/components/story/BrandClosing";
import { BrandStoryCTA } from "@/components/story/BrandStoryCTA";
import { ShopHero } from "@/components/pages/ShopHero";
import { JournalNotes } from "@/components/pages/JournalNotes";
import BaiVietClient from "@/app/bai-viet/BaiVietClient";
import { defaultsOf } from "@/lib/cms/sections";
import { str, list, itemStr, num, itemNum, formatViDate } from "@/lib/cms/fields";
import "@/app/cau-chuyen-dopamind/story.css";
import "@/app/san-pham/products.css";
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
  if (!def || !params.content || params.content.length > 200_000) return <p>Dữ liệu bản thử không hợp lệ.</p>;
  let raw: unknown;
  try { raw = JSON.parse(params.content); } catch { return <p>Dữ liệu bản thử không hợp lệ.</p>; }
  const checked = validateContent(def, raw);
  if (!checked.ok) return <p>{checked.error}</p>;
  const content = checked.value;
  const blog = (key: string) => def.key === key ? content : defaultsOf(key);
  const hero=blog("blog.hero"), featured=blog("blog.featured"), posts=blog("blog.posts"), closing=blog("blog.closing");
  const blogContent = {hero:{title:str(hero,"title"),titleEm:str(hero,"titleEm"),body:str(hero,"body"),ctaLabel:str(hero,"ctaLabel"),tags:str(hero,"tags")},featured:{eyebrow:str(featured,"eyebrow"),title:str(featured,"title"),body:str(featured,"body"),ctaLabel:str(featured,"ctaLabel"),href:str(featured,"href"),dateLabel:str(featured,"dateLabel"),minutes:num(featured,"minutes"),image:str(featured,"image")},posts:list(posts,"posts").map((p,i)=>({cat:itemStr(p,"cat"),title:itemStr(p,"title"),desc:itemStr(p,"desc"),date:itemStr(p,"date"),label:formatViDate(itemStr(p,"date")),min:itemNum(p,"min"),art:"p"+(i%6+1),href:itemStr(p,"href"),image:itemStr(p,"image")})),closing:Object.fromEntries(["quote","quoteAuthor","ctaEyebrow","ctaTitle","ctaBody","ctaLabel","ctaHref","newsTitle","newsBody"].map(k=>[k,str(closing,k)])) as {quote:string;quoteAuthor:string;ctaEyebrow:string;ctaTitle:string;ctaBody:string;ctaLabel:string;ctaHref:string;newsTitle:string;newsBody:string}};
  const nodes = {
    "story.hero": <BrandStoryHero content={content} />,
    "story.meaning": <BrandMeaning content={content} />,
    "story.pillars": <BrandPillars content={content} />,
    "story.origin": <BrandOrigin content={content} />,
    "story.closing": <BrandClosing content={content} />,
    "story.cta": <BrandStoryCTA content={content} />,
    "shop.hero": <ShopHero content={content} count={12} />,
    "journal.notes": <JournalNotes content={content} />,
    "blog.hero": <BaiVietClient content={blogContent} />,
    "blog.featured": <BaiVietClient content={blogContent} />,
    "blog.posts": <BaiVietClient content={blogContent} />,
    "blog.closing": <BaiVietClient content={blogContent} />,
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
