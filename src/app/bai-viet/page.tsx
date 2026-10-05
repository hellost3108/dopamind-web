import BaiVietClient, { type BlogContent } from "./BaiVietClient";
import { getSection } from "@/lib/cms/server";
import { formatViDate, itemNum, itemStr, list, num, str } from "@/lib/cms/fields";
import { getPublishedArticles } from "@/lib/articles";

/** Nội dung chỉnh được ở /admin/noi-dung (các khối blog.hero, blog.featured, blog.posts, blog.closing). */
export default async function BaiVietPage() {
  const [hero, featured, posts, closing, articles] = await Promise.all([
    getSection("blog.hero"),
    getSection("blog.featured"),
    getSection("blog.posts"),
    getSection("blog.closing"),
    getPublishedArticles(),
  ]);

  const featuredArticle = articles.find((article) => article.featured) ?? articles[0];
  const managedPosts = articles.map((article, i) => ({
    cat: article.category,
    title: article.title,
    desc: article.excerpt ?? "",
    date: (article.published_at ?? article.created_at).slice(0, 10),
    label: formatViDate((article.published_at ?? article.created_at).slice(0, 10)),
    min: article.reading_time,
    art: `p${(i % 6) + 1}`,
    href: `/bai-viet/${article.slug}`,
    image: article.image_url ?? "",
  }));

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
      title: featuredArticle?.title ?? str(featured, "title"),
      body: featuredArticle?.excerpt ?? str(featured, "body"),
      ctaLabel: str(featured, "ctaLabel"),
      href: featuredArticle ? `/bai-viet/${featuredArticle.slug}` : str(featured, "href"),
      dateLabel: featuredArticle ? formatViDate((featuredArticle.published_at ?? featuredArticle.created_at).slice(0, 10)) : str(featured, "dateLabel"),
      minutes: featuredArticle?.reading_time ?? num(featured, "minutes"),
      image: featuredArticle?.image_url ?? str(featured, "image"),
    },
    posts: managedPosts.length ? managedPosts : list(posts, "posts").map((p, i) => ({
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
