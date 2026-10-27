"use client";
/* eslint-disable @next/next/no-img-element -- Xem trước blob/ảnh WebP đã tối ưu, cần xử lý ảnh hỏng và kéo thả. */
import {useCallback,useEffect,useRef,useState} from "react";
import Link from "next/link";
import {mediaRequest,uploadMedia} from "@/lib/media/client";
import {canRestore,type MediaAsset,type MediaPlacement,type MediaSlot,type MediaTrash} from "@/lib/media/types";
import {btnGhost,btnPrimary,btnSmall,card,inputCls} from "@/components/admin/ui";
import {ImageEditor} from "./ImageEditor";

export type LibraryData={assets:(MediaAsset&{usedIn:string[]})[];total:number;page:number;placements:Record<string,MediaPlacement>;trash:MediaTrash[];slots:MediaSlot[]};
let cached: {time:number;promise:Promise<LibraryData>}|undefined;
export function invalidateMedia(){cached=undefined;}
export async function getMediaData(q="",page=0):Promise<LibraryData>{
  if(!q&&!page&&cached&&Date.now()-cached.time<5000)return cached.promise;
  const promise=fetch(`/api/admin/media?q=${encodeURIComponent(q)}&page=${page}`,{cache:"no-store"}).catch(()=>{throw new Error("Không kết nối được thư viện ảnh. Hãy kiểm tra mạng và thử lại.");}).then(async response=>{let data;try{data=await response.json();}catch{throw new Error("Không đọc được thư viện ảnh. Hãy tải lại trang.");}if(!response.ok)throw new Error(data.error??"Không đọc được thư viện ảnh.");return data;});
  if(!q&&!page)cached={time:Date.now(),promise};
  return promise;
}
export function MediaLibrary({onChoose,onClose}:{onChoose?:(asset:MediaAsset)=>void;onClose?:()=>void}){
  const [data,setData]=useState<LibraryData>(),[search,setSearch]=useState(""),[page,setPage]=useState(0),[tab,setTab]=useState("library"),[error,setError]=useState(""),[busy,setBusy]=useState(false),[selected,setSelected]=useState<MediaSlot>();
  const upload=useRef<HTMLInputElement>(null);
  const queryRef=useRef({search,page});
  useEffect(()=>{queryRef.current={search,page};},[search,page]);
  const refreshId=useRef(0);
  const refresh=useCallback(async()=>{const id=++refreshId.current;const query=queryRef.current;try{setError("");const next=await getMediaData(query.search,query.page);if(id===refreshId.current)setData(next);}catch(e){if(id===refreshId.current)setError(e instanceof Error?e.message:"Không đọc được thư viện ảnh.");}},[]);
  useEffect(()=>{const timer=setTimeout(()=>void refresh(),200);return()=>clearTimeout(timer);},[refresh,search,page]);
  useEffect(()=>{if(!onClose)return;const key=(e:KeyboardEvent)=>{if(e.key==="Escape")onClose();};window.addEventListener("keydown",key);return()=>window.removeEventListener("keydown",key);},[onClose]);
  async function run(body:Record<string,unknown>){setBusy(true);setError("");try{await mediaRequest(body);invalidateMedia();await refresh();}catch(e){setError(e instanceof Error?e.message:"Không thay đổi được ảnh.");}finally{setBusy(false);}}
  async function addFiles(files:FileList|null){if(!files?.length)return;setBusy(true);setError("");try{for(const file of Array.from(files))await uploadMedia(file,"");invalidateMedia();await refresh();}catch(e){setError(e instanceof Error?e.message:"Không tải được ảnh.");}finally{setBusy(false);if(upload.current)upload.current.value="";}}
  return <div className={onClose?"fixed inset-0 z-[100] overflow-y-auto bg-black/40 p-4 sm:p-8":"space-y-5"} role={onClose?"dialog":undefined} aria-modal={onClose?true:undefined} aria-label={onClose?"Chọn ảnh từ thư viện":undefined} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();if(!busy)void addFiles(e.dataTransfer.files);}}>
    <div className={onClose?`${card} mx-auto max-w-6xl`:"space-y-5"}>
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-serif text-2xl">Thư viện ảnh</h2><div className="flex gap-2"><button type="button" className={btnPrimary} disabled={busy} onClick={()=>upload.current?.click()}>{busy?"Đang xử lý...":"Thêm ảnh"}</button>{onClose&&<button type="button" className={btnGhost} onClick={onClose}>Đóng thư viện</button>}</div></div>
      <input ref={upload} hidden type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={e=>void addFiles(e.target.files)}/>
      <p className="text-sm text-charcoal/60">JPG, PNG, WebP • tối đa 20 MB. Giữ bản gốc riêng, tự tạo ảnh WebP cho điện thoại và máy tính. Xóa có thể khôi phục trong 30 ngày.</p>
      <div className="flex flex-wrap gap-2">{[["library","Ảnh đã tải lên"],["positions","Vị trí ảnh trên website"],["trash","Thùng rác"]].map(([key,label])=><button key={key} type="button" className={tab===key?btnPrimary:btnGhost} onClick={()=>{setTab(key);invalidateMedia();void refresh();}}>{label}</button>)}</div>
      <input aria-label="Tìm ảnh theo tên" placeholder="Tìm tên ảnh hoặc vị trí..." className={inputCls} value={search} onChange={e=>{setSearch(e.target.value);setPage(0);}}/>
      {error&&<p role="alert" className="text-sm text-red-600">{error}</p>}
      {!data&&!error&&<p role="status">Đang mở thư viện...</p>}
      {tab==="library"&&data&&<><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{data.assets.filter(asset=>!asset.deleted_at).map(asset=><article key={asset.id} className="overflow-hidden rounded-xl border border-black/10"><img src={asset.variants[0]?.url??asset.url} srcSet={asset.variants.filter(v=>v.url).map(v=>`${v.url} ${v.width}w`).join(", ")||undefined} sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 90vw" alt={asset.alt||asset.name} className="aspect-[4/3] w-full object-cover" loading="lazy"/><div className="space-y-2 p-3"><p className="break-words text-sm font-semibold">{asset.name}</p><p className="text-xs text-charcoal/50">{asset.width?`${asset.width} × ${asset.height} px · `:""}{Math.round(asset.bytes/1024)} KB bản gốc</p><p className="text-xs text-charcoal/60">{asset.usedIn.length?`Đang dùng: ${asset.usedIn.join("; ")}`:"Chưa được dùng trên website"}</p><div className="flex flex-wrap gap-2">{onChoose&&<button type="button" className={btnSmall} onClick={()=>onChoose(asset)}>Chọn ảnh này</button>}<button type="button" className={btnSmall} onClick={async()=>{try{const response=await fetch(`/api/admin/media?original=${asset.id}`);const result=await response.json();if(!response.ok)throw new Error(result.error);window.open(result.url,"_blank","noopener,noreferrer");}catch{setError("Không mở được bản gốc. Hãy thử lại.");}}}>Tải bản gốc</button><button type="button" className={btnSmall} disabled={busy} onClick={()=>{if(window.confirm(`Chuyển “${asset.name}” vào Thùng rác? Có thể khôi phục trong 30 ngày. Ảnh đang dùng phải được thay/gỡ trước.`))void run({operation:"trash-asset",id:asset.id});}}>Xóa ảnh</button></div></div></article>)}</div>{!data.assets.some(a=>!a.deleted_at)&&<p>Chưa có ảnh phù hợp. Bấm “Thêm ảnh” để tải lên.</p>}<div className="flex items-center gap-3"><button type="button" className={btnSmall} disabled={page===0} onClick={()=>setPage(p=>p-1)}>Trang trước</button><span className="text-sm">Trang {page+1}</span><button type="button" className={btnSmall} disabled={(page+1)*60>=data.total} onClick={()=>setPage(p=>p+1)}>Trang sau</button></div></>}
      {tab==="positions"&&data&&<div className="space-y-4">{selected?<><button type="button" className={btnSmall} onClick={()=>setSelected(undefined)}>← Chọn vị trí khác</button><h3 className="font-semibold">{selected.page} — {selected.label}</h3><ImageEditor key={selected.key} id={`slot-${selected.key}`} slot={selected.key} value={selected.url} alt={selected.alt} advice={selected.advice} onSaved={()=>{invalidateMedia();void refresh();}}/></>:data.slots.filter(slot=>`${slot.page} ${slot.label}`.toLocaleLowerCase("vi").includes(search.toLocaleLowerCase("vi"))).map(slot=><button key={slot.key} type="button" className="flex w-full items-center justify-between gap-3 rounded-xl border border-black/10 p-4 text-left text-sm" onClick={()=>setSelected(slot)}><span>{slot.page} — {slot.label}</span><span>Chỉnh ảnh →</span></button>)}</div>}
      {tab==="trash"&&data&&<div className="space-y-3">{data.trash.map(item=><article key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-black/10 p-4"><div><p className="text-sm font-semibold">{item.slot?data.slots.find(s=>s.key===item.slot)?.label??"Ảnh ở vị trí đã xóa":item.snapshot?.name??"Ảnh trong thư viện"}</p><p className="text-xs text-charcoal/50">Đã xóa: {new Date(item.deleted_at).toLocaleDateString("vi-VN")} · Khôi phục trong 30 ngày</p></div><button type="button" className={btnSmall} disabled={busy||!canRestore(item.deleted_at)} onClick={()=>void run({operation:"restore",id:item.id})}>Khôi phục ảnh</button></article>)}{!data.trash.length&&<p>Thùng rác đang trống. Ảnh bị xóa ở vị trí hoặc trong thư viện sẽ xuất hiện ở đây.</p>}</div>}
      {!onClose&&<p className="text-xs text-charcoal/50">Chỉ những ảnh được bấm Lưu vào một vị trí mới thay đổi trên website. <Link href="/admin/noi-dung" className="underline">Quay lại nội dung website</Link></p>}
    </div>
  </div>;
}
