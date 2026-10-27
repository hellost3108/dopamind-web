import sharp from "sharp";
import { MAX_IMAGE_BYTES } from "./types";

export function imageSignature(bytes: Uint8Array): "jpeg" | "png" | "webp" | null {
  if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) return "jpeg";
  if ([137,80,78,71,13,10,26,10].every((v,i)=>bytes[i]===v)) return "png";
  if (Buffer.from(bytes.slice(0,4)).toString() === "RIFF" && Buffer.from(bytes.slice(8,12)).toString() === "WEBP") return "webp";
  return null;
}

/** Chỉ nhận bitmap thật; giải mã, xoay EXIF và mã hóa lại để loại metadata/mã nhúng. */
export async function processImage(bytes: Buffer) {
  if (!bytes.length || bytes.length > MAX_IMAGE_BYTES) throw new Error("Ảnh phải nhỏ hơn hoặc bằng 20 MB.");
  const signature = imageSignature(bytes);
  if (!signature) throw new Error("Chỉ nhận file JPG, PNG hoặc WebP thật. Không nhận SVG, GIF hoặc file đổi đuôi.");
  let metadata;
  try { metadata = await sharp(bytes,{limitInputPixels:40_000_000,failOn:"warning"}).metadata(); }
  catch { throw new Error("Không đọc được ảnh. File có thể hỏng hoặc kích thước vượt 40 triệu điểm ảnh."); }
  if (metadata.format !== signature || !metadata.width || !metadata.height || (metadata.pages ?? 1) > 1) throw new Error("Chỉ nhận ảnh tĩnh JPG, PNG hoặc WebP hợp lệ.");
  const variants: {width:number;height:number;bytes:Buffer}[] = [];
  const sourceWidth=[5,6,7,8].includes(metadata.orientation??0)?metadata.height:metadata.width;
  try { for (const width of Array.from(new Set([480,960,1920,2560].map(width=>Math.min(width,sourceWidth))))) {
    const output = await sharp(bytes,{limitInputPixels:40_000_000,failOn:"warning"}).rotate().resize({width,height:2560,fit:"inside",withoutEnlargement:true}).webp({quality:84,effort:4}).toBuffer({resolveWithObject:true});
    if (!variants.some(v=>v.width===output.info.width)) variants.push({width:output.info.width,height:output.info.height,bytes:output.data});
  }
  } catch {throw new Error("Ảnh bị hỏng hoặc không giải mã được đầy đủ. Hãy xuất lại ảnh rồi tải lên.");}
  return {format:signature,variants,width:variants.at(-1)!.width,height:variants.at(-1)!.height};
}
