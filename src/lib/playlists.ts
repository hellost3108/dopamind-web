import type { Playlist } from "@/lib/types";

/**
 * PLAYLIST CONFIGURATION
 * ----------------------
 * `spotifyEmbedUrl` is intentionally unset for every entry — no real
 * DOPAMIND Spotify playlist has been linked yet. Fill it in with a real
 * `https://open.spotify.com/embed/playlist/...` URL to switch that
 * playlist from a "coming soon" tile to a live embed. See CLAUDE.md >
 * PLAYLIST ("Allow configurable Spotify URL. No broken iframe.").
 */
export const MAIN_PLAYLIST: Playlist = {
  slug: "15-phut-cho-rieng-minh",
  labelVi: "15 PHÚT CHO RIÊNG MÌNH",
  descriptionVi: "Playlist chính cho nghi thức 15 phút mỗi ngày.",
  spotifyEmbedUrl: undefined,
};

export const PLAYLISTS: Playlist[] = [
  MAIN_PLAYLIST,
  {
    slug: "reset-buoi-sang",
    labelVi: "RESET BUỔI SÁNG",
    descriptionVi: "Khởi động một ngày mới, nhẹ nhàng và tỉnh táo.",
    spotifyEmbedUrl: undefined,
  },
  {
    slug: "thu-gian-sau-gio-lam",
    labelVi: "THƯ GIÃN SAU GIỜ LÀM",
    descriptionVi: "Bỏ lại deadline, chậm lại cùng buổi tối.",
    spotifyEmbedUrl: undefined,
  },
  {
    slug: "chu-nhat-cham-rai",
    labelVi: "CHỦ NHẬT CHẬM RÃI",
    descriptionVi: "Một ngày không vội, dành cho riêng bạn.",
    spotifyEmbedUrl: undefined,
  },
  {
    slug: "skincare-dem-muon",
    labelVi: "SKINCARE ĐÊM MUỘN",
    descriptionVi: "Giai điệu êm dịu cho nghi thức trước khi ngủ.",
    spotifyEmbedUrl: undefined,
  },
];

export function getPlaylistBySlug(slug: string): Playlist | undefined {
  return PLAYLISTS.find((playlist) => playlist.slug === slug);
}
