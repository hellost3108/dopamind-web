"use client";
/* eslint-disable @next/next/no-img-element -- Xem ảnh gốc và mô phỏng vùng cắt ngay khi chỉnh. */
import {useState,type ReactNode} from "react";
import type {Focus} from "@/lib/media/types";

/** Chỉ phục vụ xem trước trong admin; không thay đổi cách website hiển thị ảnh. */
export function previewRatios(slot:string|undefined,advice:string,natural=4/3){
  const match=advice.match(/(\d+(?:\.\d+)?)\s*:\s*(\d+(?:\.\d+)?)/);
  const ratio=match?Number(match[1])/Number(match[2]):4/3;
  const logo=!!slot?.match(/^static:(header|footer)\.logo$/);
  let source=logo?natural:ratio,desktop=ratio,mobile=ratio;
  if(slot?.startsWith("home.hero.")){source=slot.endsWith(".mobile")?4/5:4/3;desktop=4/3;mobile=4/5;}
  if(slot?.startsWith("product-media:")){source=1;desktop=1;mobile=1;}
  if(slot?.startsWith("article:")){source=16/9;desktop=16/9;mobile=16/9;}
  if(slot==="cms:home.skinScience:image")mobile=4/5;
  if(slot==="cms:story.hero:image"){desktop=16/10;mobile=4/5;}
  if(slot?.startsWith("cms:story.closing:")){source=slot.endsWith(":mobileImage")?4/5:5/4;desktop=5/4;mobile=4/5;}
  return {source,desktop:logo?natural:desktop,mobile:logo?natural:mobile,fit:logo?"contain" as const:"cover" as const};
}

export function ImagePreview({slot,advice,src,alt,desktop,mobile,view,broken,onBroken,onFocus,children,placeholder,onDragOver,onDrop}:{
  slot?:string;advice:string;src:string;alt:string;desktop:Focus;mobile:Focus;view:"desktop"|"mobile";broken:boolean;
  onBroken:(broken:boolean)=>void;onFocus:(focus:Partial<Focus>)=>void;children:ReactNode;placeholder:ReactNode;
  onDragOver:React.DragEventHandler<HTMLDivElement>;onDrop:React.DragEventHandler<HTMLDivElement>;
}){
  const [size,setSize]=useState({src:"",width:4,height:3});
  const natural=size.src===src?size.width/size.height:4/3;
  const ratios=previewRatios(slot,advice,natural),point=view==="desktop"?desktop:mobile;
  const imageWidth=Math.min(1,natural/ratios.source),imageHeight=Math.min(1,ratios.source/natural);
  const visible=!!src&&!broken;
  return <div className="grid min-w-0 gap-4 lg:grid-cols-2" data-testid="image-preview">
    <div className="min-w-0 space-y-2">
      <p className="text-xs text-charcoal/60">Ảnh gốc — xem toàn bộ ảnh</p>
      <div data-testid="image-editor-dropzone" data-ratio={ratios.source} className="relative overflow-hidden rounded-xl border border-black/10 bg-black/[.04]" style={{aspectRatio:ratios.source,width:"100%",maxWidth:`min(100%, ${420*ratios.source}px, ${50*ratios.source}vh)`}} onDragOver={onDragOver} onDrop={onDrop}>
        {visible?<>
          <img data-testid="original-image" src={src} alt={alt||"Ảnh xem trước"} className="absolute inset-0 h-full w-full object-contain" onError={()=>onBroken(true)} onLoad={e=>{const image=e.currentTarget;setSize({src,width:image.naturalWidth,height:image.naturalHeight});onBroken(false);}} onClick={e=>{
            const rect=e.currentTarget.getBoundingClientRect();
            const x=((e.clientX-rect.left)/rect.width-(1-imageWidth)/2)/imageWidth;
            const y=((e.clientY-rect.top)/rect.height-(1-imageHeight)/2)/imageHeight;
            if(x>=0&&x<=1&&y>=0&&y<=1)onFocus({x:Math.round(x*100),y:Math.round(y*100)});
          }}/>
          <span data-testid="focus-marker" aria-label={`Điểm lấy nét ${point.x}% ngang, ${point.y}% dọc`} className="pointer-events-none absolute flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-charcoal text-sm leading-none text-white shadow" style={{left:`${((1-imageWidth)/2+imageWidth*point.x/100)*100}%`,top:`${((1-imageHeight)/2+imageHeight*point.y/100)*100}%`}}>+</span>
        </>:placeholder}
        {children}
      </div>
    </div>
    {visible&&<div className="min-w-0 space-y-2" data-testid="website-previews">
      <p className="text-xs text-charcoal/60">Xem thử trên website</p>
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,.6fr)] items-start gap-3">
        {(["desktop","mobile"] as const).map(device=><div key={device} className="min-w-0 space-y-2">
          <p className="text-xs text-charcoal/50">{device==="desktop"?"Máy tính":"Điện thoại"}</p>
          <div className="overflow-hidden rounded-xl border border-black/10 bg-black/[.04] p-1" style={{aspectRatio:device==="desktop"?16/10:9/16}}>
            <div className="relative overflow-hidden rounded-lg" style={{aspectRatio:ratios[device],width:`${Math.min(100,ratios[device]/(device==="desktop"?16/10:9/16)*100)}%`}}>
              <img data-testid={`website-preview-${device}`} src={src} alt={`Xem thử ${device==="desktop"?"máy tính":"điện thoại"}`} className="absolute inset-0 h-full w-full" style={{objectFit:ratios.fit,objectPosition:`${device==="desktop"?desktop.x:mobile.x}% ${device==="desktop"?desktop.y:mobile.y}%`}}/>
            </div>
          </div>
        </div>)}
      </div>
      <p className="text-xs text-charcoal/50">Vùng ảnh theo bố cục hiện tại; khung có thể thay đổi theo kích thước màn hình.</p>
    </div>}
  </div>;
}
