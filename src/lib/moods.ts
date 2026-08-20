import type { Mood, MoodSlug } from "@/lib/types";

export const MOODS: Mood[] = [
  {
    slug: "binh-tam",
    labelVi: "Bình Tâm",
    labelEn: "CALM",
    colorToken: "mint",
    promptVi: "Tôi cần mọi thứ chậm lại một chút.",
    taglineVi: "Làm dịu những ồn ào.",
  },
  {
    slug: "tai-tao",
    labelVi: "Tái Tạo",
    labelEn: "RESET",
    colorToken: "lavender",
    promptVi: "Tôi cần nạp lại năng lượng.",
    taglineVi: "Dừng lại. Phục hồi. Bắt đầu lại.",
  },
  {
    slug: "rang-ro",
    labelVi: "Rạng Rỡ",
    labelEn: "GLOW",
    colorToken: "butter",
    promptVi: "Tôi muốn lấy lại vẻ tươi tắn.",
    taglineVi: "Đánh thức vẻ rạng rỡ.",
  },
  {
    slug: "yeu-thuong",
    labelVi: "Yêu Thương",
    labelEn: "LOVE",
    colorToken: "peach",
    promptVi: "Hôm nay tôi cần được vỗ về.",
    taglineVi: "Dành cho làn da một chút yêu thương.",
  },
];

export function getMood(slug: MoodSlug): Mood {
  const mood = MOODS.find((m) => m.slug === slug);
  if (!mood) {
    throw new Error(`Unknown mood slug: ${slug}`);
  }
  return mood;
}
