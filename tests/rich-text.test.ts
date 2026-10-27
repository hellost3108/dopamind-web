import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { FormattedText } from "../src/components/content/FormattedText";
import { countCharacters, normalizeRichText, phrasingRichHtml, readRichText, sanitizeRichHtml, serializeRichText, splitRichText } from "../src/lib/rich-text/content";
import { resolveContent, validateContent } from "../src/lib/cms/fields";
import { getSectionDef, SECTION_DEFS } from "../src/lib/cms/sections";
import { fontStylesheet, RICH_TEXT_FONTS } from "../src/lib/rich-text/fonts";
import { ENTITY_TEXT_FIELDS, prepareEntityText, formattedField, editableEntity } from "../src/lib/rich-text/entities";
import { markdownEditorHtml } from "../src/lib/rich-text/markdown";
import { replaceRichText } from "../src/lib/rich-text/content";

test("toàn bộ 115 loại ô CMS được bật, giữ ô kỹ thuật và dữ liệu mặc định", () => {
  let count = 0;
  for (const def of SECTION_DEFS) for (const field of def.fields.flatMap(f => f.type === "list" ? f.fields : [f])) {
    if (field.format) { count++; assert.ok(["text","textarea"].includes(field.type)); assert.ok(!["alt","imageAlt","placeholder","number"].includes(field.key)); }
    if (def.group !== "global") {
      const display = ["text","textarea"].includes(field.type) && !["alt","imageAlt","placeholder","number"].includes(field.key);
      assert.equal(Boolean(field.format),display,`${def.key}.${field.key}`);
    }
  }
  assert.equal(count,115);
});

test("tên và mô tả giữ chữ thuần cho SQL, metadata riêng được lọc và mở lại đúng", () => {
  for (const [kind,fields] of Object.entries(ENTITY_TEXT_FIELDS)) {
    const input = Object.fromEntries(Object.entries(fields).map(([key,f])=>[key,serializeRichText('<p><strong>Chữ thử</strong><script>bad()</script></p>',f.mode)]));
    const result=prepareEntityText(kind,input);
    assert.equal(result.ok,true,kind);
    if (!result.ok) continue;
    const row={...result.values,rich_text:result.rich_text};
    for(const [key,f] of Object.entries(fields)) {
      assert.equal(result.values[key],"Chữ thử");
      assert.match(formattedField(row,key,f.mode)!,/strong/);
      assert.doesNotMatch(result.rich_text[key],/script|bad/);
      assert.equal((editableEntity(kind,row) as Record<string,unknown>)[key],result.rich_text[key]);
      assert.equal(formattedField({...row,[key]:"Đã sửa nơi khác"},key,f.mode),undefined);
      assert.equal(formattedField({[key]:"Chữ cũ"},key,f.mode),undefined);
    }
  }
  assert.equal(prepareEntityText("product",{name_vi:"a"}).ok,false);
  assert.equal(prepareEntityText("category",{name_vi:"a".repeat(141)}).ok,false);
});

test("bài Markdown cũ không tự ghi lại, trình soạn thảo giữ heading/list/trích dẫn", () => {
  const markdown="## Tiêu đề\n\nChữ **đậm** và _nghiêng_\n- Một\n- Hai\n> Trích dẫn";
  const saved=prepareEntityText("article",{title:"Bài cũ",content_markdown:markdown});
  assert.equal(saved.ok,true);
  if(saved.ok) {assert.equal(saved.values.content_markdown,markdown);assert.deepEqual(saved.rich_text,{});}
  const html=markdownEditorHtml(markdown);
  assert.match(html,/<h2>Tiêu đề<\/h2>/);assert.match(html,/<ul>/);assert.match(html,/<blockquote>/);assert.match(html,/<strong>đậm/);
});

test("tách dòng câu chuyện và biến đếm giữ định dạng, không thay href", () => {
  const rich=serializeRichText('<p><strong>Dòng một<br>Dòng hai</strong></p><p><em>Dòng ba</em></p>',"block");
  const parts=splitRichText(rich,"\n").map(v=>readRichText(v,"block"));
  assert.deepEqual(parts.map(p=>p.text),["Dòng một","Dòng hai","Dòng ba"]);
  assert.match(parts[1].html,/<strong>Dòng hai/);
  const replaced=readRichText(replaceRichText(serializeRichText('<p>Có <strong>{count}</strong> sản phẩm <a href="/{count}">x</a></p>',"block"),"{count}","12"),"block");
  assert.equal(replaced.text,"Có 12 sản phẩm x");assert.match(replaced.html,/<strong>12/);assert.match(replaced.html,/href="\/{count}"/);
});

const announcement = getSectionDef("global.announcement")!;
const payload = (html: string) => JSON.stringify({ format: "dopamind-richtext-v1", html });

test("chữ cũ, dấu tiếng Việt, ký tự HTML và nội dung gốc không bị chuyển đổi", () => {
  for (const value of ["Nghi thức 15 phút — thư giãn", "Chữ <đậm> & bình thường", '<script>alert("chữ cũ")</script>', '{"format":"khác","html":"nội dung"}']) {
    assert.equal(normalizeRichText(value, "inline"), value);
    assert.equal(readRichText(value, "inline").text, value);
    assert.equal(resolveContent(announcement, { text: value }).text, value);
  }
  assert.deepEqual(resolveContent(announcement, undefined), announcement.defaults);
});

test("chỉ bật nhóm thông tin chung đã được duyệt, gồm cả tên mạng xã hội", () => {
  const enabled = SECTION_DEFS.filter((def) => def.group === "global").flatMap((def) => def.fields.flatMap((field) => field.type === "list" ? field.fields.filter((sub) => sub.format).map((sub) => `${def.key}.${field.key}[].${sub.key}`) : field.format ? [`${def.key}.${field.key}`] : []));
  assert.deepEqual(enabled, ["global.announcement.text", "global.footer.tagline", "global.footer.copyright", "global.footer.social[].label"]);
});

test("Trang chủ bật đúng 43 loại ô chữ của 8 khối, giữ các ô kỹ thuật như cũ", () => {
  const home = SECTION_DEFS.filter((def) => def.group === "home");
  assert.equal(home.length, 8);
  let enabled = 0;
  for (const def of SECTION_DEFS) {
    for (const field of def.fields.flatMap((field) => field.type === "list" ? field.fields : [field])) {

      if (def.group !== "home") continue;
      const excluded = ["alt", "imageAlt", "number", "placeholder"].includes(field.key) || !["text", "textarea"].includes(field.type);
      assert.equal(field.format, excluded ? undefined : field.type === "text" ? "inline" : "block", `${def.key}.${field.key}`);
      if (field.format) enabled++;
    }
  }
  assert.equal(enabled, 43);
});

test("mọi ô Trang chủ mới đều giữ mặc định cũ và lưu/đọc được định dạng từng trường", () => {
  for (const def of SECTION_DEFS) {
    const before = JSON.stringify(def.defaults);
    assert.deepEqual(resolveContent(def, undefined), def.defaults);
    for (const field of def.fields) {
      const entries = field.type === "list" ? field.fields.filter((sub) => sub.format) : field.format ? [field] : [];
      for (const target of entries) {
        const values = structuredClone(def.defaults);
        const rich = serializeRichText("<p><strong>Chữ thử</strong></p>", target.format!);
        if (field.type === "list") (values[field.key] as Record<string, string | number | boolean>[])[0][target.key] = rich;
        else values[field.key] = rich;
        const checked = validateContent(def, values);
        assert.equal(checked.ok, true, `${def.key}.${field.key}.${target.key}`);
        if (checked.ok) assert.deepEqual(resolveContent(def, checked.value), checked.value);
      }
    }
    assert.equal(JSON.stringify(def.defaults), before);
  }
});

test("dấu | tách các ý DOPA/MIND nhưng giữ dấu, màu, link và dấu định dạng băng qua ranh giới", () => {
  assert.deepEqual(splitRichText(" A | B | ", "|"), ["A", "B"]);
  const value = serializeRichText('<p><strong>A | B</strong> | <span style="color:#9688ff"><em>C</em></span> | <a href="https://example.com/?a=x|y">D</a></p>', "block");
  const parts = splitRichText(value, "|").map((part) => readRichText(part, "block"));
  assert.deepEqual(parts.map((part) => part.text), ["A", "B", "C", "D"]);
  assert.match(parts[0].html, /<strong>A/);
  assert.match(parts[1].html, /<strong>B/);
  assert.match(parts[2].html, /color:#9688ff/);
  assert.match(parts[3].html, /href="https:\/\/example.com\/\?a=x\|y"/);
});

test("tiêu đề/mô tả dùng HTML phrasing hợp lệ và vẫn lọc mã độc", () => {
  const html = phrasingRichHtml('<p style="text-align:center"><strong>Đầu</strong><br>Cuối</p><ol><li><p>Một</p></li></ol><script>alert(1)</script>');
  assert.doesNotMatch(html, /<\/?(?:p|div|ol|ul|li|script)\b|alert/);
  assert.match(html, /text-align:center/);
  assert.match(html, /role="list"/);
  assert.match(html, /role="listitem"/);
  const old = renderToStaticMarkup(createElement("h2", null, createElement(FormattedText, {value:"Dòng 1\nDòng 2", mode:"block",phrasing:true})));
  assert.equal(old,"<h2>Dòng 1\nDòng 2</h2>");
  const formatted = renderToStaticMarkup(createElement("h2", null, createElement(FormattedText, {value:serializeRichText('<p>Dòng <strong>1</strong></p>',"block"),mode:"block",phrasing:true})));
  assert.doesNotMatch(formatted, /<p|<div/);
  assert.match(formatted, /<strong>1<\/strong>/);
});

test("lưu và đọc giữ định dạng, không cắt mã khi vượt 140 ký tự HTML", () => {
  const value = serializeRichText('<p>Xin <strong>chào</strong> <span style="font-family: Fraunces; font-size: 24px; color: #9688ff">Việt Nam</span></p>', "inline");
  assert.ok(value.length > 140);
  const checked = validateContent(announcement, { text: value, href: "/san-pham" });
  assert.equal(checked.ok, true);
  if (!checked.ok) return;
  const read = readRichText(String(resolveContent(announcement, checked.value).text), "inline");
  assert.equal(read.text, "Xin chào Việt Nam");
  assert.match(read.html, /<strong>chào<\/strong>/);
  assert.match(read.html, /font-size:24px/);
  assert.deepEqual(read.fonts, ["Fraunces"]);
  assert.equal(checked.value.href, "/san-pham");
});

test("140 chữ thật được chấp nhận; 141 chữ bị từ chối dù nhập trực tiếp lên máy chủ", () => {
  for (const text of ["á".repeat(140), "a\u0301".repeat(140)]) {
    assert.equal(countCharacters(text), 140);
    assert.equal(validateContent(announcement, { text: serializeRichText(`<strong>${text}</strong>`, "inline"), href: "" }).ok, true);
  }
  assert.equal(validateContent(announcement, { text: payload(`<em>${"á".repeat(141)}</em>`), href: "" }).ok, false);
  assert.equal(validateContent(announcement, { text: "a\nb", href: "" }).ok, false);
});

test("lọc script, sự kiện, ảnh, SVG, CSS lạ và font ngoài danh sách ở cả lưu lẫn đọc", () => {
  const unsafe = '<script>alert(1)</script><img src=x onerror=alert(1)><svg onload=alert(1)></svg><span onclick="alert(1)" style="color:#9688ff;position:fixed;background:url(https://evil.test);font-family:evil;font-size:999px">An toàn</span>';
  for (const html of [readRichText(payload(unsafe), "inline").html, readRichText(normalizeRichText(payload(unsafe), "inline"), "inline").html]) {
    assert.doesNotMatch(html, /script|alert|onerror|onclick|svg|position|background|evil|999/);
    assert.match(html, /color:#9688ff/);
    assert.equal(readRichText(payload(html), "inline").text, "An toàn");
  }
});

test("một dòng không giữ link, danh sách, gạch chân hoặc xuống dòng khi dán", () => {
  const clean = sanitizeRichHtml('<p>Một</p><ul><li><strong>hai</strong></li><li><u>ba</u></li></ul><a href="https://example.com"> bốn</a><br>năm', "inline");
  assert.doesNotMatch(clean, /<\/?(?:p|ul|ol|li|u|a|br)\b|[\r\n]/);
  assert.match(clean, /<strong>hai<\/strong>/);
  assert.match(readRichText(payload(clean), "inline").text, /Một.*hai.*ba.*bốn.*năm/);
});

test("đường dẫn nguy hiểm bị chặn, không chấp nhận URL tương đối giao thức", () => {
  for (const href of ["javascript:alert(1)", "&#106;avascript:alert(1)", "data:text/html,test", "//evil.test", "vbscript:test", "java&#10;script:alert(1)"]) {
    const clean = sanitizeRichHtml(`<a href="${href}">Link</a>`, "block");
    assert.doesNotMatch(clean, /href="[^"]+"/);
  }
  for (const href of ["https://example.com", "/san-pham", "#bai-viet", "mailto:test@example.com"]) {
    assert.match(sanitizeRichHtml(`<a href="${href}">Link</a>`, "block"), /href=/);
  }
});

test("nội dung rỗng ẩn thanh; entities được đếm đúng; không cắt/chuyển các ô khác", () => {
  assert.equal(serializeRichText("<p><strong> </strong></p>", "inline"), "");
  assert.equal(readRichText(payload("A &amp; B &lt;3"), "inline").text, "A & B <3");
  const other = getSectionDef("home.hero")!;
  assert.equal(validateContent(other, { ...other.defaults, primaryHref: "javascript:test" }).ok, false);
  assert.equal(resolveContent(other, undefined).line1, other.defaults.line1);
});

test("font dùng đúng family và chỉ tạo URL cho font cho phép", () => {
  assert.equal(RICH_TEXT_FONTS.length, 21);
  assert.equal(fontStylesheet("evil&family=Unknown"), null);
  for (const font of RICH_TEXT_FONTS) {
    assert.match(fontStylesheet(font.family)!, /subset=latin,vietnamese/);
    assert.deepEqual(readRichText(serializeRichText(`<span style="font-family:'${font.family}'">Chữ</span>`, "inline"), "inline").fonts, [font.family]);
  }
});

test("hiển thị từ máy chủ giữ chữ cũ, lọc HTML và chỉ tải font đang dùng", () => {
  const old = renderToStaticMarkup(createElement(FormattedText, { value: "Chữ <b>cũ</b> & an toàn" }));
  assert.equal(old, "Chữ &lt;b&gt;cũ&lt;/b&gt; &amp; an toàn");
  const formatted = renderToStaticMarkup(createElement(FormattedText, { value: payload('<span style="font-family:Fraunces;color:#9688ff"><strong>Việt Nam</strong></span><img src=x onerror=alert(1)>') }));
  assert.match(formatted, /<strong>Việt Nam<\/strong>/);
  assert.match(formatted, /family=Fraunces/);
  assert.doesNotMatch(formatted, /onerror|<img|Barlow/);
});

test("footer giữ nguyên mặc định và lưu/đọc định dạng của cả mục mạng xã hội", () => {
  const def = getSectionDef("global.footer")!;
  assert.deepEqual(resolveContent(def, undefined), def.defaults);
  const input = { ...def.defaults, tagline: serializeRichText('<p style="text-align:center">Chăm <u>da</u></p><ul><li><p>Thư giãn</p></li><li><p>Nghỉ ngơi</p></li></ul>', "block"), copyright: serializeRichText("<strong>DOPAMIND</strong>", "inline"), social: [{ label: serializeRichText('<span style="color:#9688ff">Instagram</span>', "inline"), href: "https://instagram.com/" }] };
  const checked = validateContent(def, input);
  assert.equal(checked.ok, true);
  if (!checked.ok) return;
  assert.deepEqual(resolveContent(def, checked.value), checked.value);
  const text = readRichText(String(checked.value.tagline), "block");
  assert.equal(text.text, "Chăm da\nThư giãn\nNghỉ ngơi");
  assert.match(text.html, /text-align:center/);
  assert.match(text.html, /<u>da<\/u>/);
  assert.match(text.html, /<ul>/);
  assert.match(renderToStaticMarkup(createElement(FormattedText, {value:String(checked.value.tagline),mode:"block"})), /list-disc/);
});

test("footer kiểm tra 200/120/30 chữ thật và vẫn chặn link mạng xã hội không an toàn", () => {
  const def = getSectionDef("global.footer")!;
  const input = { ...def.defaults, tagline: serializeRichText(`<p>${"á".repeat(200)}</p>`, "block"), copyright: serializeRichText(`<em>${"á".repeat(120)}</em>`, "inline"), social: [{ label: serializeRichText(`<strong>${"á".repeat(30)}</strong>`, "inline"), href: "https://example.com/" }] };
  assert.equal(validateContent(def, input).ok, true);
  assert.equal(validateContent(def, {...input,tagline:serializeRichText(`<p>${"á".repeat(201)}</p>`,"block")}).ok, false);
  assert.equal(validateContent(def, {...input,copyright:serializeRichText(`<em>${"á".repeat(121)}</em>`,"inline")}).ok, false);
  assert.equal(validateContent(def, {...input,social:[{...input.social[0],label:serializeRichText(`<strong>${"á".repeat(31)}</strong>`,"inline")}]}).ok, false);
  assert.equal(validateContent(def, {...input,social:[{...input.social[0],href:"javascript:alert(1)"}]}).ok, false);
});
