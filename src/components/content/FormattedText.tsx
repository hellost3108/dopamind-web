import { phrasingRichHtml, readRichText, type RichTextMode } from "@/lib/rich-text/content";
import { fontStylesheet } from "@/lib/rich-text/fonts";

/** Bộ hiển thị chung. Lọc lại ngay trước khi tạo HTML, kể cả dữ liệu từ DB. */
export function FormattedText({ value, mode = "inline", phrasing = false }: { value: string; mode?: RichTextMode; phrasing?: boolean }) {
  const content = readRichText(value, mode);
  if (!content.formatted) return <>{value}</>;
  const Tag = mode === "inline" || phrasing ? "span" : "div";
  return (
    <>
      {content.fonts.map((family) => <link key={family} rel="stylesheet" href={fontStylesheet(family.split("::")[0],family.includes("::")?Number(family.split("::")[1]):undefined)!} precedence="rich-text-fonts" data-rich-text-font={family} />)}
      <Tag className={mode === "block" ? "[&_p]:m-0 [&_p+p]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_a]:underline" : undefined} dangerouslySetInnerHTML={{ __html: mode === "block" && phrasing ? phrasingRichHtml(content.html) : content.html }} />
    </>
  );
}
