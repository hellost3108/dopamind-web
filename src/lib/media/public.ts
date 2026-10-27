import "server-only";
import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseUrl,getSupabaseAnonKey } from "@/lib/supabase-env";
import { normalizeFocus,validImageUrl,type MediaPlacement } from "./types";
export const getPublicPlacements=cache(async():Promise<Record<string,MediaPlacement>>=>{
  try{
    const db=createClient(getSupabaseUrl(),getSupabaseAnonKey(),{auth:{persistSession:false},global:{fetch:(input,init)=>fetch(input,{...init,next:{revalidate:60}})}});
    const rows:MediaPlacement[]=[];
    for(let offset=0;;offset+=1000){const result=await db.from("media_placements").select("slot,asset_id,url,alt,desktop,mobile,disabled,variants").range(offset,offset+999);if(result.error)return {};rows.push(...result.data as MediaPlacement[]);if(result.data.length<1000)break;}
    return Object.fromEntries(rows.filter(row=>row.disabled||validImageUrl(row.url)).map(row=>[row.slot,{...row,desktop:normalizeFocus(row.desktop),mobile:normalizeFocus(row.mobile)}]));
  }catch{return {};}
});
