// Ngôn ngữ giao diện chung của trang admin — theo đúng Admin Studio của melalogy
// (nền be #f5f2ee, chữ #191716, nhấn đỏ #f52334, nút bo tròn, thẻ bo góc lớn).
// Muốn đổi màu nhấn: thay "#f52334" bằng màu khác trong thư mục src/components/admin và src/app/admin.

export const inputCls =
  "w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm text-[#191716] outline-none transition placeholder:text-black/30 focus:border-[#f52334] focus:ring-2 focus:ring-[#f52334]/10 disabled:bg-black/[0.03] disabled:text-black/40";

export const labelCls = "mb-1.5 block text-sm font-semibold text-black/70";
export const helpCls = "mt-1.5 block text-xs font-normal leading-5 text-black/45";

// Các kiểu nút của melalogy: primary / dark / ghost / icon / danger
export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#f52334] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#d91a2b] disabled:cursor-not-allowed disabled:opacity-50";
export const btnDark =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#191716] px-5 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50";
export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-full border border-black/15 bg-white px-4 py-2.5 text-sm font-semibold text-black/70 transition hover:border-[#f52334] hover:text-[#f52334] disabled:cursor-not-allowed disabled:opacity-50";
export const btnSmall =
  "inline-flex items-center justify-center gap-2 rounded-full border border-black/15 bg-white px-4 py-2 text-xs font-semibold text-black/70 transition hover:border-[#f52334] hover:text-[#f52334] disabled:cursor-not-allowed disabled:opacity-40";
export const btnIcon =
  "grid h-9 w-9 shrink-0 place-items-center rounded-full border border-black/10 bg-white text-black/55 transition hover:border-[#f52334] hover:text-[#f52334] disabled:cursor-not-allowed disabled:opacity-40";
export const btnDanger =
  "inline-flex items-center justify-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50";

export const card = "rounded-3xl border border-black/10 bg-white p-5 shadow-sm sm:p-7";
export const chip = "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold";
