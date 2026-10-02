import BaiVietClient, { type BlogContent } from "./BaiVietClient";
import { getSection } from "@/lib/cms/server";
import { formatViDate, itemNum, itemStr, list, num, str } from "@/lib/cms/fields";

/** Nội dung chỉnh được ở /admin/noi-dung (các khối blog.hero, blog.featured, blog.posts, blog.closing). */
export default async function BaiVietPage() {
  const [hero, featured, posts, closing] = await Promise.all([
    getSection("blog.hero"),
    getSection("blog.featured"),
    getSection("blog.posts"),
    getSection("blog.closing"),
  ]);

  const content: BlogContent = {
    hero: {
      title: str(hero, "title"),
      titleEm: str(hero, "titleEm"),
      body: str(hero, "body"),
      ctaLabel: str(hero, "ctaLabel"),
      tags: str(hero, "tags"),
    },
    featured: {
      eyebrow: str(featured, "eyebrow"),
      title: str(featured, "title"),
      body: str(featured, "body"),
      ctaLabel: str(featured, "ctaLabel"),
      href: str(featured, "href"),
      dateLabel: str(featured, "dateLabel"),
      minutes: num(featured, "minutes"),
      image: str(featured, "image"),
    },
    posts: list(posts, "posts").map((p, i) => ({
      cat: itemStr(p, "cat"),
      title: itemStr(p, "title"),
      desc: itemStr(p, "desc"),
      date: itemStr(p, "date"),
      label: formatViDate(itemStr(p, "date")),
      min: itemNum(p, "min"),
      art: `p${(i % 6) + 1}`,
      href: itemStr(p, "href"),
      image: itemStr(p, "image"),
    })),
    closing: {
      quote: str(closing, "quote"),
      quoteAuthor: str(closing, "quoteAuthor"),
      ctaEyebrow: str(closing, "ctaEyebrow"),
      ctaTitle: str(closing, "ctaTitle"),
      ctaBody: str(closing, "ctaBody"),
      ctaLabel: str(closing, "ctaLabel"),
      ctaHref: str(closing, "ctaHref"),
      newsTitle: str(closing, "newsTitle"),
      newsBody: str(closing, "newsBody"),
    },
  };

  return <BaiVietClient content={content} />;
}
