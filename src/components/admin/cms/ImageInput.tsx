"use client";
import {ImageEditor} from "@/components/admin/media/ImageEditor";
export function ImageInput(props:{id:string;value:string;onChange:(next:string)=>void;slot?:string;alt?:string;advice?:string;onAltChange?:(next:string)=>void}){return <ImageEditor {...props}/>;}
