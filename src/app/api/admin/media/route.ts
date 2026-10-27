import {NextResponse} from "next/server";
import {revalidatePath} from "next/cache";
import {getAdminUser} from "@/lib/admin/auth";
import {createClient} from "@/lib/supabase/server";
import {untyped} from "@/lib/cms/untyped";
import {assetView,ensureProcessedAsset,libraryData,mediaError,savePlacement,PRODUCT_IMAGE_BUCKET} from "@/lib/media/server";
import {processImage} from "@/lib/media/process";
import {MAX_IMAGE_BYTES,normalizeFocus} from "@/lib/media/types";

export const runtime="nodejs";
export const maxDuration=60;
const fail=(error:string,status=400)=>NextResponse.json({error},{status});
export async function GET(request:Request){
  if(!await getAdminUser())return fail("Bạn cần đăng nhập tài khoản biên tập để quản lý ảnh.",401);
  const params=new URL(request.url).searchParams,db=untyped(await createClient());
  try{
    if(params.get("original")){const {data,error}=await db.from("media_assets").select("original_bucket,original_path").eq("id",params.get("original")).single();if(error)return fail(mediaError(error));const signed=await db.storage.from(data.original_bucket).createSignedUrl(data.original_path,60);if(signed.error)return fail("Không tải được bản gốc.");return NextResponse.json({url:signed.data.signedUrl},{headers:{"Cache-Control":"no-store"}});}
    const result=await libraryData(db,(params.get("q")??"").slice(0,200),Math.max(0,Math.min(10000,Number(params.get("page"))||0)));
    return NextResponse.json(result,{headers:{"Cache-Control":"no-store"}});
  }catch(error){return fail(error instanceof Error?error.message:"Không đọc được thư viện ảnh.");}
}
export async function POST(request:Request){
  const admin=await getAdminUser();if(!admin)return fail("Bạn cần đăng nhập tài khoản biên tập để quản lý ảnh.",401);
  const origin=request.headers.get("origin");if(!origin||origin!==new URL(request.url).origin)return fail("Yêu cầu không hợp lệ. Hãy tải lại trang admin.",403);
  if(Number(request.headers.get("content-length")??0)>65536)return fail("Dữ liệu yêu cầu quá lớn.",413);
  const db=untyped(await createClient());
  try{
    const bytes:Uint8Array[]=[];let length=0;const reader=request.body?.getReader();
    if(!reader)return fail("Yêu cầu ảnh chưa có dữ liệu.");
    while(true){const part=await reader.read();if(part.done)break;length+=part.value.byteLength;if(length>65536){await reader.cancel();return fail("Dữ liệu yêu cầu quá lớn.",413);}bytes.push(part.value);}
    const parsed:unknown=JSON.parse(Buffer.concat(bytes).toString("utf8"));
    if(!parsed||typeof parsed!=="object"||Array.isArray(parsed))return fail("Dữ liệu ảnh không hợp lệ.");
    const input=parsed as Record<string,unknown>;
    if(input.operation==="init-upload"){
      const name=String(input.name??"").slice(0,240),size=Number(input.size),type=String(input.type);
      if(!/\.(jpg|jpeg|png|webp)$/i.test(name)||!["image/jpeg","image/png","image/webp"].includes(type))return fail("Chỉ nhận ảnh JPG, PNG hoặc WebP.");
      if(!Number.isInteger(size)||size<=0||size>MAX_IMAGE_BYTES)return fail("Ảnh phải nhỏ hơn hoặc bằng 20 MB.");
      const id=crypto.randomUUID(),ext=name.split(".").at(-1)!.toLowerCase(),path=`${admin.id}/${id}/original.${ext}`;
      const pending=await db.from("media_assets").insert({id,name,bytes:size,alt:String(input.alt??"").slice(0,500),original_bucket:"brand-originals",original_path:path,ready:false,created_by:admin.id});
      if(pending.error)return fail(mediaError(pending.error));
      const signed=await db.storage.from("brand-originals").createSignedUploadUrl(path,{upsert:false});
      if(signed.error)return fail("Không chuẩn bị được nơi tải ảnh. Hãy kiểm tra cấu hình thư viện ảnh trong Supabase.");
      return NextResponse.json({id,path,token:signed.data.token});
    }else if(input.operation==="complete-upload"){
      const {data:pending,error}=await db.from("media_assets").select("*").eq("id",input.id).eq("created_by",admin.id).eq("ready",false).single();
      if(error)return fail("Không tìm thấy lượt tải ảnh của bạn. Hãy chọn lại file.");
      const download=await db.storage.from("brand-originals").download(pending.original_path);
      if(download.error)return fail("Chưa tải được bản gốc đầy đủ. Hãy thử tải lại ảnh.");
      if(download.data.size!==pending.bytes||download.data.size>MAX_IMAGE_BYTES)return fail("Kích thước file không khớp. Hãy chọn và tải lại ảnh.");
      const processed=await processImage(Buffer.from(await download.data.arrayBuffer()));
      const extension=pending.name.split(".").at(-1)?.toLowerCase();
      if(!(processed.format==="jpeg"?["jpg","jpeg"]:[processed.format]).includes(extension))return fail("Nội dung ảnh không khớp đuôi file. Hãy xuất lại đúng JPG, PNG hoặc WebP.");
      const variants=[];const attempt=crypto.randomUUID();
      for(const v of processed.variants){const path=`managed/${pending.id}/${attempt}/${v.width}.webp`;const result=await db.storage.from(PRODUCT_IMAGE_BUCKET).upload(path,v.bytes,{contentType:"image/webp",cacheControl:"31536000",upsert:false});
        if(result.error){for(const item of variants)await db.storage.from(PRODUCT_IMAGE_BUCKET).remove([item.path]);return fail("Không tải được ảnh WebP. Hãy thử lại.");}
        variants.push({path,width:v.width,height:v.height});}
      const saved=await db.from("media_assets").update({ready:true,width:processed.width,height:processed.height,variants}).eq("id",pending.id).eq("ready",false).select("*").single();
      if(saved.error){await db.storage.from(PRODUCT_IMAGE_BUCKET).remove(variants.map(v=>v.path));return fail(mediaError(saved.error));}
      return NextResponse.json({asset:assetView(saved.data)},{status:201});
    }else if(input.operation==="attach-product"){
      const {data:asset,error}=await db.from("media_assets").select("*").eq("id",input.asset_id).eq("ready",true).is("deleted_at",null).single();
      if(error)return fail("Không tìm thấy ảnh trong thư viện.");
      const view=await ensureProcessedAsset(db,asset);
      const attached=await db.rpc("attach_library_product_media",{p_product:input.product_id,p_asset:asset.id,p_value:{url:view.url,variants:view.variants,alt:String(input.alt??view.alt).trim().slice(0,200),desktop:normalizeFocus(input.desktop),mobile:normalizeFocus(input.mobile)}});
      if(attached.error)return fail(mediaError(attached.error));
    }else if(input.operation==="restore"){
      const result=await db.rpc("manage_media_placement",{p_operation:"restore",p_slot:"",p_value:{id:input.id},p_expected:null});if(result.error)return fail(mediaError(result.error));
    }else if(input.operation==="trash-asset"){
      const all=await libraryData(db,"",0);const {data:asset,error}=await db.from("media_assets").select("*").eq("id",input.id).single();if(error)return fail(mediaError(error));
      const url=assetView(asset).url;const originalUrl=asset.original_bucket===PRODUCT_IMAGE_BUCKET?assetView({...asset,variants:[]}).url:"";const inUse=all.slots.filter(slot=>{const p=all.placements[slot.key];const currentUrl=p?.url??slot.url;return !p?.disabled&&((!!currentUrl&&[url,originalUrl].includes(currentUrl))||p?.asset_id===asset.id);});
      if(inUse.length)return fail(`Ảnh đang dùng ở ${inUse.map(s=>s.page).join(", ")}. Hãy thay hoặc gỡ ảnh ở các vị trí đó trước.`);
      const {error:trashError}=await db.rpc("trash_media_asset",{p_id:asset.id});if(trashError)return fail(mediaError(trashError));
    }else await savePlacement(db,input);
    revalidatePath("/","layout");
    return NextResponse.json({ok:true});
  }catch(error){return fail(error instanceof SyntaxError?"Dữ liệu ảnh chưa hợp lệ. Hãy tải lại trang và thử lại.":error instanceof Error?error.message:"Không xử lý được ảnh. Vui lòng thử lại.");}
}
