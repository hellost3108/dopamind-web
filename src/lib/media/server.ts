import "server-only";
import type {SupabaseClient} from "@supabase/supabase-js";
import {getProductImageUrl,PRODUCT_IMAGE_BUCKET} from "@/lib/supabase-storage";
import {getImageSlots} from "./registry";
import {processImage} from "./process";
import {CENTER,normalizeFocus,validImageUrl,type MediaAsset,type MediaPlacement,type ImageVariant} from "./types";

export const MEDIA_SETUP_ERROR="Chưa tạo thư viện ảnh. Hãy chạy tệp supabase/migrations/20261027110000_media_library.sql trong Supabase → SQL Editor.";
export function mediaError(error:{code?:string;message?:string}){
  if(["42P01","PGRST205","42703","PGRST204"].includes(error.code??""))return MEDIA_SETUP_ERROR;
  if(error.code==="42501")return "Tài khoản chưa có quyền quản lý ảnh. Hãy đăng nhập tài khoản biên tập trong admin.";
  if(error.code==="P0001")return error.message??"Không thể thay đổi ảnh lúc này.";
  return "Không thể lưu ảnh. Vui lòng thử lại; ảnh hiện tại chưa bị thay đổi.";
}
export function assetView(row:Omit<MediaAsset,"url">):MediaAsset{
  const variants=(Array.isArray(row.variants)?row.variants:[]).map(v=>({...v,url:getProductImageUrl(v.path)}));
  return {...row,variants,url:variants.at(-1)?.url??getProductImageUrl(row.original_path)};
}
/** Ảnh cũ được giữ nguyên file; khi dùng lại mới giải mã và tạo bản WebP an toàn. */
export async function ensureProcessedAsset(db:SupabaseClient,row:Omit<MediaAsset,"url">):Promise<MediaAsset>{
  if(Array.isArray(row.variants)&&row.variants.length)return assetView(row);
  const source=await db.storage.from(row.original_bucket).download(row.original_path);
  if(source.error)throw new Error("Không đọc được ảnh gốc trong thư viện. Hãy tải ảnh mới.");
  const processed=await processImage(Buffer.from(await source.data.arrayBuffer()));
  const attempt=crypto.randomUUID(),variants:ImageVariant[]=[];
  try{
    for(const item of processed.variants){const path=`managed/${row.id}/${attempt}/${item.width}.webp`;const uploaded=await db.storage.from(PRODUCT_IMAGE_BUCKET).upload(path,item.bytes,{contentType:"image/webp",upsert:false,cacheControl:"31536000"});if(uploaded.error)throw new Error("Không tạo được bản WebP. Hãy thử lại.");variants.push({path,width:item.width,height:item.height});}
    const result=await db.from("media_assets").update({variants,width:processed.width,height:processed.height}).eq("id",row.id).select("*").single();if(result.error)throw new Error(mediaError(result.error));return assetView(result.data);
  }catch(error){if(variants.length)await db.storage.from(PRODUCT_IMAGE_BUCKET).remove(variants.map(v=>v.path));throw error;}
}
export async function libraryData(db:SupabaseClient,search:string,page:number){
  let query=db.from("media_assets").select("*",{count:"exact"}).eq("ready",true).is("deleted_at",null).order("created_at",{ascending:false}).range(page*60,page*60+59);
  if(search)query=query.ilike("name",`%${search.replace(/[%_\\]/g,"\\$&")}%`);
  const [assets,placements,trash,slots]=await Promise.all([query,db.from("media_placements").select("*"),db.from("media_trash").select("*").is("restored_at",null).gte("deleted_at",new Date(Date.now()-30*86400000).toISOString()).order("deleted_at",{ascending:false}),getImageSlots(db)]);
  for(const result of [assets,placements,trash])if(result.error)throw new Error(mediaError(result.error));
  const placementMap:Record<string,MediaPlacement>=Object.fromEntries((placements.data??[]).map(row=>[row.slot,row as MediaPlacement]));
  const usage:Record<string,string[]>={};
  for(const slot of slots){const placement=placementMap[slot.key];if(placement?.disabled)continue;const url=placement?.url??slot.url;if(!url)continue;(usage[url]??=[]).push(`${slot.page} — ${slot.label}`);}
  const items=(assets.data??[]).map(row=>assetView(row as Omit<MediaAsset,"url">)).map(asset=>({...asset,usedIn:Array.from(new Set([...(usage[asset.url]??[]),...(asset.original_bucket===PRODUCT_IMAGE_BUCKET?usage[getProductImageUrl(asset.original_path)]??[]:[]),...Object.values(placementMap).filter(p=>!p.disabled&&p.asset_id===asset.id&&slots.some(s=>s.key===p.slot)).map(p=>{const s=slots.find(s=>s.key===p.slot);return s?`${s.page} — ${s.label}`:p.slot;})]))}));
  return {assets:items,total:assets.count??0,page,placements:placementMap,trash:trash.data??[],slots};
}

export async function savePlacement(db:SupabaseClient,input:Record<string,unknown>){
  const slotKey=typeof input.slot==="string"?input.slot:"";
  const slot=(await getImageSlots(db)).find(s=>s.key===slotKey);
  if(!slot)throw new Error("Không tìm thấy vị trí ảnh. Hãy lưu bài viết hoặc danh mục trước, rồi tải lại trang.");
  const {data:current,error:currentError}=await db.from("media_placements").select("*").eq("slot",slotKey).maybeSingle();
  if(currentError)throw new Error(mediaError(currentError));
  if(input.operation==="reset"){
    const original=slot.originalUrl??slot.url;
    const value={slot:slotKey,url:original,alt:slot.originalAlt??slot.alt,asset_id:null,desktop:CENTER,mobile:CENTER,variants:[],disabled:!original};
    const result=await db.rpc("manage_media_placement",{p_operation:original===slot.url?"reset":"save",p_slot:slotKey,p_value:value,p_expected:typeof input.expected==="string"?input.expected:null});
    if(result.error)throw new Error(mediaError(result.error));return result.data;
  }
  let url=slot.url,assetId:string|null=null,variants:ImageVariant[]=[];
  if(input.operation==="delete"){
    const snapshot=current??{slot:slotKey,asset_id:null,url:slot.url,alt:slot.alt,desktop:CENTER,mobile:CENTER,variants:[]};
    const result=await db.rpc("manage_media_placement",{p_operation:"delete",p_slot:slotKey,p_value:snapshot,p_expected:typeof input.expected==="string"?input.expected:null});
    if(result.error)throw new Error(mediaError(result.error));return result.data;
  }
  if(input.asset_id){const {data:asset,error}=await db.from("media_assets").select("*").eq("id",input.asset_id).eq("ready",true).is("deleted_at",null).maybeSingle();if(error)throw new Error(mediaError(error));if(!asset)throw new Error("Ảnh không còn trong thư viện. Hãy chọn lại ảnh khác.");const view=await ensureProcessedAsset(db,asset);url=view.url;assetId=view.id;variants=view.variants;}
  else if(current&&input.operation==="delete"){url=current.url;assetId=current.asset_id;variants=current.variants??[];}
  else if(input.url!==undefined&&input.url!==slot.url)throw new Error("Hãy chọn ảnh trong thư viện hoặc tải một file ảnh mới.");
  if(url&&!validImageUrl(url))throw new Error("Đường dẫn ảnh không hợp lệ.");
  const value={disabled:false,slot:slotKey,asset_id:assetId,url,alt:String(input.alt??slot.alt).trim().slice(0,500),desktop:normalizeFocus(input.desktop??CENTER),mobile:normalizeFocus(input.mobile??CENTER),variants};
  if(!value.url)throw new Error("Hãy chọn hoặc tải một ảnh trước khi lưu.");
  const {data,error}=await db.rpc("manage_media_placement",{p_operation:"save",p_slot:slotKey,p_value:value,p_expected:typeof input.expected==="string"?input.expected:null});
  if(error)throw new Error(mediaError(error));
  return data;
}
export {PRODUCT_IMAGE_BUCKET};
