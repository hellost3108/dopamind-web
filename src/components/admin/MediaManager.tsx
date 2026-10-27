"use client";
import {useState,useTransition} from "react";
import {useRouter} from "next/navigation";
import {setPrimaryMediaAction} from "@/app/admin/actions";
import type {AdminMedia} from "@/lib/admin/data";
import {ImageEditor} from "@/components/admin/media/ImageEditor";
import {mediaRequest} from "@/lib/media/client";
import {btnSmall,card} from "@/components/admin/ui";
export function MediaManager({productId,productName,media}:{productId:string;productName:string;media:AdminMedia[]}){
 const router=useRouter(),[error,setError]=useState(""),[pending,startTransition]=useTransition();
 return <section className={card}><h2 className="font-serif text-xl">Ảnh sản phẩm</h2><p className="mt-1 text-xs text-charcoal/50">Tải ảnh mới hoặc chọn ảnh có sẵn. Ảnh được xóa khỏi vị trí vẫn khôi phục được trong 30 ngày.</p>
 {error&&<p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
 <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{media.map(m=><div key={m.id} className="space-y-3 rounded-xl border border-black/10 p-3"><p className="text-xs font-medium">{m.is_primary?"Ảnh chính":"Ảnh bổ sung"}</p><ImageEditor id={"product-media-"+m.id} slot={"product-media:"+m.id} value={m.url} alt={m.alt_vi??productName} advice="Ảnh vuông 1:1, ít nhất 1600 × 1600 px."/>{!m.is_primary&&<button type="button" disabled={pending} className={btnSmall} onClick={()=>startTransition(async()=>{const result=await setPrimaryMediaAction(m.id);if(!result.ok)setError(result.error??"Không đặt được ảnh chính.");else router.refresh();})}>Đặt làm ảnh chính</button>}</div>)}
 <div className="space-y-3 rounded-xl border border-dashed border-black/20 p-3"><p className="text-sm font-semibold">Thêm ảnh sản phẩm</p><ImageEditor key={media.length} id="new-product-image" value="" alt={productName} advice="Ảnh vuông 1:1, ít nhất 1600 × 1600 px." onAssetSaved={async image=>{if(!image.asset_id)throw new Error("Hãy tải hoặc chọn một ảnh trước khi lưu.");await mediaRequest({operation:"attach-product",product_id:productId,...image});router.refresh();}}/></div></div></section>;
}
