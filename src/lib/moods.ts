import type { Mood, MoodSlug } from "@/lib/types";

export const MOODS: Mood[] = [
  { slug: "binh-tam", labelVi: "Bình Tâm", labelEn: "CALM", colorToken: "mint" },
  { slug: "tai-tao", labelVi: "Tái Tạo", labelEn: "RESET", colorToken: "lavender" },
  { slug: "rang-ro", labelVi: "Rạng Rỡ", labelEn: "GLOW", colorToken: "butter" },
  { slug: "yeu-thuong", labelVi: "Yêu Thương", labelEn: "LOVE", colorToken: "peach" },
];

export function getMood(slug: MoodSlug): Mood {
  const mood = MOODS.find((m) => m.slug === slug);
  if (!mood) {
    throw new Error(`Unknown mood slug: ${slug}`);
  }
  return mood;
}
