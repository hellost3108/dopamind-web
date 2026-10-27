"use client";
import {createClient} from "@/lib/supabase/client";
import {MAX_IMAGE_BYTES,type MediaAsset} from "./types";
export async function mediaRequest(body:Record<string,unknown>){
  const response=await fetch("/api/admin/media",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
  let data;
  try{data=await response.json();}catch{throw new Error("Máy chủ chưa xử lý được ảnh. Hãy thử lại.");}
  if(!response.ok)throw new Error(data.error??"Không lưu được ảnh. Vui lòng thử lại.");
  return data;
}
export async function uploadMedia(file:File,alt:string):Promise<MediaAsset>{
  if(!["image/jpeg","image/png","image/webp"].includes(file.type)||! /\.(jpg|jpeg|png|webp)$/i.test(file.name))throw new Error("Chỉ nhận ảnh JPG, PNG hoặc WebP.");
  if(!file.size||file.size>MAX_IMAGE_BYTES)throw new Error("Ảnh phải nhỏ hơn hoặc bằng 20 MB.");
  // File lớn đi thẳng vào vùng bản gốc riêng tư; máy chủ vẫn xác minh/giải mã trước khi công khai WebP.
  const pending=await mediaRequest({operation:"init-upload",name:file.name,type:file.type,size:file.size,alt});
  const uploaded=await createClient().storage.from("brand-originals").uploadToSignedUrl(pending.path,pending.token,file,{contentType:file.type,upsert:false});
  if(uploaded.error)throw new Error("Không tải được bản gốc. Kiểm tra kết nối và thử lại.");
  return (await mediaRequest({operation:"complete-upload",id:pending.id})).asset;
}
