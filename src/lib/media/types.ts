export type Focus = { x: number; y: number; enabled?: boolean };
export type ImageVariant = { width: number; height: number; path: string; url?: string };
export type MediaAsset = {
  id: string; name: string; alt: string; original_bucket: string; original_path: string;
  width: number; height: number; bytes: number; variants: ImageVariant[];
  created_at: string; deleted_at: string | null; url: string;
};
export type MediaPlacement = {
  slot: string; asset_id: string | null; url: string; alt: string;
  desktop: Focus; mobile: Focus; disabled: boolean; updated_at?: string;
  variants?: ImageVariant[];
};
export type MediaSlot = { key: string; label: string; page: string; href: string; url: string; alt: string; advice: string; originalUrl?:string; originalAlt?:string };
export type MediaTrash = { id: string; slot: string | null; asset_id: string | null; snapshot: (Partial<MediaPlacement>&{name?:string}) | null; deleted_at: string; restored_at: string | null };
export const CENTER: Focus = { x: 50, y: 50 };
export const RESTORE_DAYS = 30;
export const MAX_IMAGE_BYTES = 20 * 1024 * 1024;
export function imageAdvice(hint:string){if(/\d\s*[×x]\s*\d|\bpx\b/i.test(hint))return hint;const size=hint.includes("4:5")?"1600 × 2000":hint.includes("16:9")?"1920 × 1080":hint.includes("1:1")?"1600 × 1600":"1600 × 1200";return `${hint} Kích thước khuyên dùng ít nhất ${size} px.`;}
export function validMediaKey(value:unknown):value is string{return typeof value==="string"&&/^(?:\d{1,3}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i.test(value);}
export function cmsImageSlot(section:string,list:string,index:number,field:string,row:Record<string,unknown>){return `cms:${section}:${list}:${validMediaKey(row._mediaId)?row._mediaId:index}:${field}`;}
export function validImageUrl(value: unknown): value is string {
  return typeof value === "string" && value.length <= 2000 && !/[\s\u0000-\u001f]/.test(value) && (/^\/(?!\/)/.test(value) || /^https:\/\//i.test(value));
}
export function normalizeFocus(raw: unknown): Focus {
  const v = raw && typeof raw === "object" ? raw as Record<string,unknown> : {};
  const axis = (n: unknown) => typeof n === "number" && Number.isFinite(n) ? Math.min(100, Math.max(0,n)) : 50;
  return {x:axis(v.x),y:axis(v.y),...(v.enabled === true ? {enabled:true} : {})};
}
export function canRestore(deletedAt: string, now = Date.now()) {
  const deleted = Date.parse(deletedAt);
  return Number.isFinite(deleted) && deleted <= now && now - deleted <= RESTORE_DAYS * 86_400_000;
}
