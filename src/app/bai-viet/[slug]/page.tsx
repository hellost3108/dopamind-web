import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/article/ArticleBody";
import { getPublishedArticle } from "@/lib/articles";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  if (!article) return {};
  return { title: article.seo_title || article.title, description: article.seo_description || article.excerpt || undefined };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublishedArticle(slug);
  if (!article) notFound();
  const date = new Intl.DateTimeFormat("vi-VN", { dateStyle: "long" }).format(new Date(article.published_at ?? article.created_at));
  return (
    <article className="bg-cloud-milk px-[clamp(20px,4vw,64px)] py-[clamp(48px,7vw,112px)]">
      <div className="mx-auto max-w-4xl">
        <Link href="/bai-viet" className="text-xs font-semibold uppercase tracking-[.14em] text-purple">← Tất cả bài viết</Link>
        <p className="mt-10 text-xs font-semibold uppercase tracking-[.18em] text-charcoal/50">{article.category}</p>
        <h1 className="mt-5 text-balance font-serif text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.02] tracking-[-.03em]">{article.title}</h1>
        {article.excerpt && <p className="mt-7 max-w-3xl text-lg leading-8 text-charcoal/65">{article.excerpt}</p>}
        <p className="mt-6 text-sm text-charcoal/45">{article.author || "DOPAMIND"} · {date} · {article.reading_time} phút đọc</p>
        {article.image_url && <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-2xl bg-lavender/20"><Image src={article.image_url} alt={article.image_alt || article.title} fill sizes="(min-width: 896px) 896px, 100vw" className="object-cover" /></div>}
        <div className="mx-auto mt-10 max-w-3xl"><ArticleBody markdown={article.content_markdown} /></div>
      </div>
    </article>
  );
}

