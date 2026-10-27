import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { SECTION_DEFS } from "@/lib/cms/sections";
import { resolveContent, list, itemStr, str } from "@/lib/cms/fields";
import { getProductImageUrl } from "@/lib/supabase-storage";
import { STATIC_IMAGE_SLOTS } from "./static-slots";
import {cmsImageSlot} from "./types";
import type { MediaSlot } from "./types";

async function allRows(db: SupabaseClient,table:string,select:string) {
  const rows: Record<string,unknown>[]=[];
  for(let offset=0;;offset+=1000){const result=await db.from(table).select(select).range(offset,offset+999);if(result.error)throw new Error(`Không đọc được dữ liệu ảnh (${table}).`);const batch=result.data as unknown as Record<string,unknown>[];rows.push(...batch);if(batch.length<1000)break;}
  return rows;
}
export async function getImageSlots(db: SupabaseClient): Promise<MediaSlot[]> {
  const [sections,articles,categories,media]=await Promise.all([
    allRows(db,"site_sections","key,content"),allRows(db,"articles","id,title,slug,image_url,image_alt"),
    allRows(db,"categories","id,name_vi,image_path"),allRows(db,"product_media","id,product_id,storage_path,alt_vi,products(name_vi,slug)"),
  ]);
  const saved=Object.fromEntries(sections.map(row=>[row.key,row.content]));
  const slots:MediaSlot[]=[...STATIC_IMAGE_SLOTS];
  for(const def of SECTION_DEFS){const content=resolveContent(def,saved[def.key]);
    for(const field of def.fields){if(field.type==="image")slots.push({key:`cms:${def.key}:${field.key}`,label:field.label,page:def.label,href:def.path,url:str(content,field.key),originalUrl:str(def.defaults,field.key),originalAlt:str(def.defaults,"imageAlt"),alt:str(content,"imageAlt"),advice:field.help??"Tỉ lệ 4:3; ít nhất 1600 × 1200 px. Với banner ngang dùng 1920 × 1080 px."});
      if(field.type==="list")list(content,field.key).forEach((row,index)=>field.fields.filter(sub=>sub.type==="image").forEach(sub=>slots.push({key:cmsImageSlot(def.key,field.key,index,sub.key,row),label:`${field.itemLabel} ${index+1} — ${sub.label}`,page:def.label,href:def.path,url:itemStr(row,sub.key),originalUrl:itemStr(list(def.defaults,field.key)[Number(row._mediaId??index)]??row,sub.key),originalAlt:itemStr(list(def.defaults,field.key)[Number(row._mediaId??index)]??row,"alt"),alt:itemStr(row,"alt"),advice:sub.help??"Tỉ lệ 4:3, ít nhất 1600 × 1200 px."})));}
  }
  for(const row of articles)slots.push({key:`article:${row.id}`,label:String(row.title),page:"Bài viết",href:`/bai-viet/${row.slug}`,url:String(row.image_url??""),alt:String(row.image_alt??""),advice:"Ảnh bìa 16:9, ít nhất 1920 × 1080 px."});
  for(const row of categories)slots.push({key:`category:${row.id}`,label:String(row.name_vi),page:"Danh mục",href:"/san-pham",url:String(row.image_path??""),alt:String(row.name_vi),advice:"Ảnh 4:3, ít nhất 1600 × 1200 px."});
  for(const row of media){const product=(Array.isArray(row.products)?row.products[0]:row.products) as {name_vi?:string;slug?:string}|null;slots.push({key:`product-media:${row.id}`,label:product?.name_vi??"Ảnh sản phẩm",page:"Sản phẩm",href:product?.slug?`/san-pham/${product.slug}`:`/admin/san-pham/${row.product_id}`,url:getProductImageUrl(String(row.storage_path)),alt:String(row.alt_vi??""),advice:"Ảnh vuông 1:1, ít nhất 1600 × 1600 px."});}
  return slots;
}
