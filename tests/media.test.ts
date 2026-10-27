import assert from "node:assert/strict";
import test from "node:test";
import sharp from "sharp";
import {processImage,imageSignature} from "../src/lib/media/process";
import {canRestore,normalizeFocus,cmsImageSlot,imageAdvice,validImageUrl,MAX_IMAGE_BYTES} from "../src/lib/media/types";
import {resolveContent,validateContent} from "../src/lib/cms/fields";
import {getSectionDef} from "../src/lib/cms/sections";
import {EDITOR_FONTS,fontStylesheet} from "../src/lib/rich-text/fonts";
import {serializeRichText,readRichText} from "../src/lib/rich-text/content";

test("menu font có đúng bốn lựa chọn và tải đúng độ đậm, vẫn đọc font cũ",()=>{
  assert.deepEqual(EDITOR_FONTS.map(f=>[f.label,f.weight]),[["Libre Caslon Display",400],["Montserrat ExtraBold",800],["Be Vietnam Pro Regular",400],["Be Vietnam Pro Medium",500]]);
  for(const font of EDITOR_FONTS){const value=serializeRichText(`<span style='font-family:${font.fallback};font-weight:${font.weight}'>Tiếng Việt: Ắ ằ ễ ộ ự</span>`,"inline"),read=readRichText(value,"inline");assert.match(read.html,new RegExp(`font-weight:${font.weight}`));assert.ok(read.fonts.includes(`${font.family}::${font.weight}`));assert.match(fontStylesheet(font.family,font.weight)!,new RegExp(`wght@${font.weight}&`));assert.match(fontStylesheet(font.family,font.weight)!,/subset=latin,vietnamese/);}
  const legacy=readRichText(serializeRichText('<span style="font-family:Fraunces">Cũ</span>',"inline"),"inline");assert.deepEqual(legacy.fonts,["Fraunces"]);
});
test("giải mã ảnh thật, tạo WebP theo thiết bị, không sửa buffer gốc và không phóng lớn",async()=>{
  const original=await sharp({create:{width:2400,height:1600,channels:4,background:{r:120,g:90,b:210,alpha:.5}}}).png().toBuffer(),copy=Buffer.from(original);
  const result=await processImage(original);
  assert.equal(result.format,"png");assert.deepEqual(result.variants.map(v=>v.width),[480,960,1920,2400]);assert.deepEqual(original,copy);
  for(const v of result.variants){const meta=await sharp(v.bytes).metadata();assert.equal(meta.format,"webp");assert.equal(meta.width,v.width);assert.equal(meta.height,v.height);assert.equal(meta.hasAlpha,true);assert.equal(meta.exif,undefined);}
  const small=await sharp({create:{width:100,height:80,channels:3,background:"white"}}).jpeg().toBuffer();assert.deepEqual((await processImage(small)).variants.map(v=>v.width),[100]);
});
test("chặn SVG, HTML, GIF, đổi đuôi giả, ảnh hỏng và ảnh quá lớn",async()=>{
  for(const text of ['<svg onload="alert(1)"></svg>','<html><script>alert(1)</script></html>',"GIF89a"]){assert.equal(imageSignature(Buffer.from(text)),null);await assert.rejects(processImage(Buffer.from(text)),/JPG|PNG|WebP/);}
  await assert.rejects(processImage(Buffer.from([255,216,255,1,2,3])),/Không đọc|không giải mã/);
  await assert.rejects(processImage(Buffer.alloc(MAX_IMAGE_BYTES+1)),/20 MB/);
});
test("loại EXIF khỏi bản công khai, giữ nguyên bản gốc có metadata",async()=>{
  const original=await sharp({create:{width:800,height:600,channels:3,background:"pink"}}).withExif({IFD0:{Artist:"Kiem tra anh"}}).jpeg().toBuffer();
  assert.ok((await sharp(original).metadata()).exif);
  for(const v of (await processImage(original)).variants)assert.equal((await sharp(v.bytes).metadata()).exif,undefined);
});
test("thùng rác khôi phục trong 30 ngày, chặn ngày giả và quá hạn",()=>{
  const now=Date.parse("2026-10-27T00:00:00Z");assert.equal(canRestore(new Date(now-30*86400000).toISOString(),now),true);assert.equal(canRestore(new Date(now-31*86400000).toISOString(),now),false);assert.equal(canRestore("lỗi",now),false);assert.equal(canRestore(new Date(now+1000).toISOString(),now),false);
});
test("điểm lấy nét chỉ bật khi chỉnh, giới hạn 0–100; URL không nhận mã",()=>{
  assert.deepEqual(normalizeFocus({x:200,y:-12,enabled:true}),{x:100,y:0,enabled:true});assert.deepEqual(normalizeFocus({x:NaN,y:"12"}),{x:50,y:50});assert.equal(validImageUrl("javascript:alert(1)"),false);assert.equal(validImageUrl("//host/file.png"),false);assert.equal(validImageUrl("/images/a.png"),true);assert.match(imageAdvice("Tỉ lệ 4:5."),/1600 × 2000 px/);
});
test("sắp xếp danh sách giữ ảnh đúng thẻ, không làm mất metadata khi lưu và đọc",()=>{
  const def=getSectionDef("home.journal")!,values=resolveContent(def,undefined),rows=values.cards as Record<string,string>[];
  const original=rows.map((row,i)=>({...row,_mediaId:String(i)}));
  const before=cmsImageSlot(def.key,"cards",0,"image",original[0]);
  values.cards=[original[1],original[0],...original.slice(2)];const checked=validateContent(def,values);assert.equal(checked.ok,true);
  if(checked.ok){const loaded=resolveContent(def,checked.value).cards as Record<string,string>[];assert.equal(cmsImageSlot(def.key,"cards",1,"image",loaded[1]),before);}
});
