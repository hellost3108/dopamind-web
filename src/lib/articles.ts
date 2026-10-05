import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { untyped } from "@/lib/cms/untyped";

export type ArticleStatus = "draft" | "published" | "archived";

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content_markdown: string;
  category: string;
  author: string | null;
  image_url: string | null;
  image_alt: string | null;
  reading_time: number;
  status: ArticleStatus;
  featured: boolean;
  sort_order: number;
  seo_title: string | null;
  seo_description: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ArticleListResult = { rows: Article[]; tableMissing: boolean };

const isMissing = (code?: string) => code === "42P01" || code === "PGRST205";

export async function getAdminArticles(): Promise<ArticleListResult> {
  const db = untyped(await createClient());
  const { data, error } = await db.from("articles").select("*").order("updated_at", { ascending: false });
  if (error) {
    if (isMissing(error.code)) return { rows: [], tableMissing: true };
    console.error("Không đọc được articles:", error);
    return { rows: [], tableMissing: false };
  }
  return { rows: (data ?? []) as Article[], tableMissing: false };
}

export async function getAdminArticle(id: string): Promise<Article | null> {
  const db = untyped(await createClient());
  const { data, error } = await db.from("articles").select("*").eq("id", id).maybeSingle();
  if (error) console.error("Không đọc được article:", error);
  return (data as Article | null) ?? null;
}

export const getPublishedArticles = cache(async (): Promise<Article[]> => {
  const db = untyped(await createClient());
  const { data, error } = await db
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("published_at", { ascending: false })
    .order("sort_order", { ascending: true });
  if (error) {
    if (!isMissing(error.code)) console.error("Không đọc được bài viết công khai:", error);
    return [];
  }
  return (data ?? []) as Article[];
});

export const getPublishedArticle = cache(async (slug: string): Promise<Article | null> => {
  const db = untyped(await createClient());
  const { data, error } = await db
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) {
    if (!isMissing(error.code)) console.error("Không đọc được bài viết:", error);
    return null;
  }
  return (data as Article | null) ?? null;
});

