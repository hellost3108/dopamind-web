"use client";
import { useState } from "react";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { ProductForm } from "@/components/admin/ProductForm";
import { prepareEntityText, formattedField } from "@/lib/rich-text/entities";
import { FormattedText } from "@/components/content/FormattedText";
import { ArticleBody } from "@/components/article/ArticleBody";
export default function EntitiesPreview(){
 const [kind,setKind]=useState("article"),[result,setResult]=useState<ReturnType<typeof prepareEntityText>>();
 return <main className="mx-auto max-w-5xl p-6"><h1 className="text-2xl">Thử form bài viết, sản phẩm, danh mục</h1><p className="my-4">Bản thử chặn gửi form tới database, chỉ kiểm tra dữ liệu trên máy.</p>
 <label>Loại nội dung<select aria-label="Loại nội dung" value={kind} onChange={e=>{setKind(e.target.value);setResult(undefined);}}>{["article","product","category"].map(k=><option key={k}>{k}</option>)}</select></label>
 <div className="mt-32" key={kind} onSubmitCapture={e=>{e.preventDefault();e.stopPropagation();const input=Object.fromEntries(new FormData(e.target as HTMLFormElement));setResult(prepareEntityText(kind,input));}}>
 {kind==="article"?<ArticleForm values={{title:"Bài viết cũ",status:"draft",content_markdown:"## Tiêu đề cũ\n\nChữ **đậm**\n- Một\n- Hai\n> Trích dẫn"}}/>:kind==="category"?<CategoryForm values={{name_vi:"Danh mục cũ"}}/>:<ProductForm values={{name_vi:"Sản phẩm cũ",slug:"san-pham-cu",status:"draft",short_description_vi:"",description_vi:"",featured:false,is_new:false,seo_title:"",seo_description:""}} variants={[]} categories={[]} moods={[]} skinNeeds={[]} categoryIds={[]} moodIds={[]} skinNeedIds={[]}/>}
 </div>
 {result&&<section data-testid="entity-preview" className="mt-8">{result.ok?<>{Object.keys(result.values).map(key=><div key={key} data-field={key}><FormattedText value={formattedField({...result.values,rich_text:result.rich_text},key,["excerpt","description_vi","content_markdown"].includes(key)?"block":"inline")??result.values[key]} mode={["excerpt","description_vi","content_markdown"].includes(key)?"block":"inline"}/></div>)}{kind==="article"&&<ArticleBody markdown={result.rich_text.content_markdown??result.values.content_markdown}/>}<pre data-testid="canonical">{JSON.stringify(result.values)}</pre><p role="status">Đã lưu bản thử</p></>:<p role="alert">{result.error}</p>}</section>}
 </main>;
}
