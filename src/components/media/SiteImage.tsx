"use client";
/* eslint-disable @next/next/no-img-element -- Xem trước blob/ảnh WebP đã tối ưu, cần xử lý ảnh hỏng và kéo thả. */
import Image,{type ImageProps} from "next/image";
import {useState,type CSSProperties,type ReactNode} from "react";
import {useMediaPlacement} from "./MediaProvider";
import styles from "./SiteImage.module.css";

/** Chưa chỉnh ảnh thì giữ nguyên props, kích thước và hiệu ứng của vị trí cũ. */
export function SiteImage({slot,native=false,optional=false,frameClassName,src,alt,...props}:Omit<ImageProps,"src">&{src:string;slot?:string;native?:boolean;optional?:boolean;frameClassName?:string}){
  const placement=useMediaPlacement(slot),source=placement?.disabled?"":placement?.url??src;
  const [failed,setFailed]=useState<string|null>(null);
  const wrap=(child:ReactNode)=>frameClassName?<div className={frameClassName}>{child}</div>:child;
  const className=[props.className,placement?.desktop.enabled?styles.desktopFocus:"",placement?.mobile.enabled?styles.mobileFocus:""].filter(Boolean).join(" ");
  const style={...props.style,...(placement?{"--image-desktop-focus":`${placement.desktop.x}% ${placement.desktop.y}%`,"--image-mobile-focus":`${placement.mobile.x}% ${placement.mobile.y}%`}:{})} as CSSProperties;
  if(optional&&!source&&!placement)return null;
  if(!source||failed===source)return wrap(<span role="img" aria-label={placement?.alt||alt||"Ảnh đang cập nhật"} className={`${className} ${styles.placeholder}`} style={{...style,...(props.fill?{position:"absolute",inset:0,width:"100%",height:"100%"}:{width:props.width,height:props.height})}}>Ảnh đang cập nhật</span>);
  const imageAlt=placement?placement.alt:alt;
  const variants=(placement?.variants??[]).filter(v=>v.url).map(v=>`${v.url} ${v.width}w`).join(", ");
  if(native)return wrap(<img src={source} alt={imageAlt} className={className} style={{...style,...(props.fill?{position:"absolute",inset:0,width:"100%",height:"100%"}:{})}} width={props.width} height={props.height} srcSet={variants||undefined} sizes={props.sizes} loading={props.priority?"eager":"lazy"} onClick={props.onClick} onError={()=>setFailed(source)}/>);
  return wrap(<Image {...props} src={source} alt={imageAlt} className={className} style={style} onError={()=>setFailed(source)}/>);
}
