import { SECTION_DEFS } from "../src/lib/cms/sections";
import { serializeRichText } from "../src/lib/rich-text/content";
import { expect, test, type Page } from "@playwright/test";

async function selectText(page: Page, start: number, end: number, field = "#announcement") {
  await page.locator(field).evaluate((element, range) => {
    element.focus();
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = [];
    while (walker.nextNode()) nodes.push(walker.currentNode as Text);
    const locate = (offset: number): [Text, number] => {
      for (const node of nodes) {
        if (offset <= node.length) return [node, offset];
        offset -= node.length;
      }
      return [nodes[nodes.length - 1], nodes[nodes.length - 1].length];
    };
    const selection = window.getSelection()!;
    const selectionRange = document.createRange();
    selectionRange.setStart(...locate(range.start));
    selectionRange.setEnd(...locate(range.end));
    selection.removeAllRanges(); selection.addRange(selectionRange);
    document.dispatchEvent(new Event("selectionchange"));
  }, { start, end });
  await expect(page.getByRole("button", { name: "In đậm", exact: true })).toBeEnabled();
}

test("định dạng vùng chọn, lưu, hoàn tác và khôi phục; ô thường giữ nguyên kiểu dáng", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  const editor = page.locator("#announcement");
  await expect(editor).toBeVisible();
  await expect(editor).toHaveCSS("border-radius", "12px");
  const original = await editor.innerText();
  await expect(page.getByRole("toolbar")).toHaveCount(0);
  await editor.click();
  await expect(page.getByRole("toolbar")).toBeVisible();
  await expect(page.getByLabel("Font chữ")).toBeDisabled();
  await editor.fill("Xin chào Việt Nam");
  await selectText(page, 4, 8);
  await page.getByRole("button", { name: "In đậm", exact: true }).click();
  await expect(editor.locator("strong")).toHaveText("chào");
  await expect(editor).toHaveText("Xin chào Việt Nam");
  await page.getByLabel("Cỡ chữ", { exact: true }).selectOption("24px");
  await expect(editor.locator("strong")).toHaveCSS("font-size", "24px");
  await page.getByLabel("Font chữ", { exact: true }).selectOption("be-vietnam-500");
  await expect(page.locator('link[data-rich-text-font="Be Vietnam Pro::500"]')).toHaveCount(1);
  await expect(page.locator('link[data-rich-text-font="Barlow"]')).toHaveCount(0);
  await page.getByLabel("Màu chữ", { exact: true }).fill("#9688ff");
  await expect(editor.locator("strong")).toHaveCSS("color", "rgb(150, 136, 255)");
  await expect(page.locator("#announcement-count")).toHaveText("17/140");
  await page.locator("#ordinary").click();
  await expect(page.getByRole("toolbar")).toHaveCount(0);
  await page.getByRole("button", { name: "Lưu thay đổi", exact: true }).click();
  await expect(page.getByTestId("public-preview").locator("strong")).toHaveText("chào");
  await expect(page.getByTestId("public-preview").locator("strong")).toHaveCSS("color", "rgb(150, 136, 255)");
  await editor.fill("Chỉnh chưa lưu");
  await page.getByRole("button", { name: "Hoàn tác", exact: true }).click();
  await expect(editor.locator("strong")).toHaveText("chào");
  await expect(editor).toHaveText("Xin chào Việt Nam");
  await page.getByRole("button", { name: "Khôi phục nội dung gốc", exact: true }).click();
  await expect(editor).toHaveText(original);
  await expect(page.getByTestId("public-preview")).toContainText(original);
  const dimensions = await page.locator("#ordinary").evaluate((input) => {
    const editor = document.querySelector("#announcement")!;
    const a = getComputedStyle(input), b = getComputedStyle(editor);
    return [a.borderRadius === b.borderRadius, a.padding === b.padding, a.borderWidth === b.borderWidth, input.getBoundingClientRect().height === editor.getBoundingClientRect().height];
  });
  expect(dimensions).toEqual([true, true, true, true]);
  expect(errors).toEqual([]);
});

test("một dòng chặn Enter, danh sách, link, giới hạn ký tự và xóa định dạng", async ({ page }) => {
  await page.goto("/");
  const editor = page.locator("#announcement");
  await editor.fill("Một dòng");
  await editor.press("End");
  await editor.press("Enter");
  await editor.press("Shift+Enter");
  await expect(editor.locator("p")).toHaveCount(1);
  await expect(editor.locator("br,ul,ol,a")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Chèn link", exact: true })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Gạch chân", exact: true })).toHaveCount(0);
  await editor.fill("");
  await editor.evaluate((element) => {
    const clipboard = new DataTransfer();
    clipboard.setData("text/html", '<p>Xin <strong>chào</strong></p><ul><li>Việt Nam</li></ul><img src=x onerror="window.pasteAttack=true">');
    clipboard.setData("text/plain", "Xin chào\nViệt Nam");
    element.dispatchEvent(new ClipboardEvent("paste", { clipboardData: clipboard, bubbles: true, cancelable: true }));
  });
  await expect(editor).toHaveText("Xin chào Việt Nam");
  await expect(editor.locator("strong")).toHaveText("chào");
  await expect(editor.locator("p")).toHaveCount(1);
  await expect(editor.locator("img,ul,ol,a,br")).toHaveCount(0);
  await editor.fill("a".repeat(140));
  await editor.press("End");
  await page.keyboard.type("b");
  await expect(editor).toHaveText("a".repeat(140));
  await expect(page.locator("#announcement-count")).toHaveText("140/140");
  await selectText(page, 0, 4);
  await page.getByRole("button", { name: "In đậm", exact: true }).click();
  await expect(editor.locator("strong")).toHaveCount(1);
  await page.getByRole("button", { name: "Xóa định dạng", exact: true }).click();
  await expect(editor.locator("strong,em,span[style]")).toHaveCount(0);
});

test("thanh công cụ nằm trên ô và không tràn ở màn hình điện thoại", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.locator("#announcement").click();
  const toolbar = await page.getByRole("toolbar").boundingBox();
  const field = await page.locator("#announcement").boundingBox();
  expect(toolbar!.y + toolbar!.height).toBeLessThanOrEqual(field!.y);
  expect(toolbar!.x).toBeGreaterThanOrEqual(0);
  expect(toolbar!.x + toolbar!.width).toBeLessThanOrEqual(390);
  await page.screenshot({ path: "test-results/rich-text-mobile.png", fullPage: true });
});

test("footer nhiều dòng: gạch chân, căn lề, link, danh sách và bộ đếm", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/footer");
  const editor = page.locator("#footer-tagline");
  await expect(editor).toBeVisible();
  const original = await editor.innerText();
  const heights = await page.locator("#footer-link-0").evaluate((input) => {
    const control = document.createElement("textarea");
    control.className = input.className; control.rows = 4;
    document.body.appendChild(control);
    const sizes = [control.getBoundingClientRect().height, document.querySelector("#footer-tagline")!.getBoundingClientRect().height];
    control.remove(); return sizes;
  });
  expect(heights[1]).toBe(heights[0]);
  await editor.fill("Chăm da");
  await selectText(page, 0, 4, "#footer-tagline");
  await page.getByRole("button", {name:"Gạch chân",exact:true}).click();
  await expect(editor.locator("u")).toHaveText("Chăm");
  await page.getByRole("button", {name:"Căn giữa",exact:true}).click();
  await page.getByRole("button", {name:"Chèn link",exact:true}).click();
  await page.getByRole("textbox", {name:"Đường dẫn liên kết",exact:true}).fill("https://dopamind.vn/");
  await page.getByRole("button", {name:"Áp dụng",exact:true}).click();
  await page.getByRole("button", {name:"Lưu thay đổi",exact:true}).click();
  const preview = page.getByTestId("footer-tagline-preview");
  await expect(preview.locator("u")).toHaveText("Chăm");
  await expect(preview.locator("p")).toHaveCSS("text-align","center");
  await expect(preview.locator("a")).toHaveAttribute("href","https://dopamind.vn/");
  await editor.fill("Thư giãn");
  await selectText(page, 0, 8, "#footer-tagline");
  await page.getByRole("button", {name:"• Danh sách",exact:true}).click();
  await expect(editor.locator("ul li")).toHaveText("Thư giãn");
  await expect(page.locator("#footer-tagline-count")).toHaveText("8/200");
  await page.getByRole("button", {name:"1. Danh sách",exact:true}).click();
  await page.getByRole("button", {name:"Lưu thay đổi",exact:true}).click();
  await expect(preview.locator("ol li")).toHaveText("Thư giãn");
  await expect(preview.locator("ol")).toHaveCSS("list-style-type","decimal");
  await editor.fill("Chưa lưu");
  await page.getByRole("button", {name:"Hoàn tác",exact:true}).click();
  await expect(editor.locator("ol li")).toHaveText("Thư giãn");
  await selectText(page,0,8,"#footer-tagline");
  await page.getByRole("button",{name:"Xóa định dạng",exact:true}).click();
  await expect(editor.locator("ul,ol,u,a,[style]")).toHaveCount(0);
  await page.getByRole("button", {name:"Khôi phục nội dung gốc",exact:true}).click();
  await expect(editor).toHaveText(original);
  await expect(preview).toHaveText(original);
  expect(errors).toEqual([]);
});

test("footer một dòng: bản quyền, tên mạng xã hội, link thường và hoàn tác", async ({ page }) => {
  await page.goto("/footer");
  const copyright = page.locator("#footer-copyright");
  await copyright.fill("DOPAMIND Mask Story");
  await selectText(page,0,8,"#footer-copyright");
  await expect(page.getByRole("button",{name:"Gạch chân",exact:true})).toHaveCount(0);
  await page.getByRole("button",{name:"In đậm",exact:true}).click();
  const social = page.locator("#footer-social-0");
  await social.fill("Instagram");
  await selectText(page,0,9,"#footer-social-0");
  await page.getByRole("button",{name:"In nghiêng",exact:true}).click();
  await expect(page.getByTestId("social-title-0")).toHaveText("Liên kết 1 · Instagram");
  await page.locator("#footer-link-0").fill("https://instagram.com/");
  await expect(page.getByRole("toolbar")).toHaveCount(0);
  await page.getByRole("button",{name:"Lưu thay đổi",exact:true}).click();
  await expect(page.getByTestId("footer-copyright-preview").locator("strong")).toHaveText("DOPAMIND");
  await expect(page.getByTestId("footer-social-preview-0").locator("em")).toHaveText("Instagram");
  await expect(page.getByTestId("footer-social-preview-0")).toHaveAttribute("href","https://instagram.com/");
  await social.fill("Chưa lưu");
  await page.getByRole("button",{name:"Hoàn tác",exact:true}).click();
  await expect(social.locator("em")).toHaveText("Instagram");
  await expect(page.locator("#footer-link-0")).toHaveValue("https://instagram.com/");
});

test("footer điện thoại: thanh đầy đủ ở phía trên, cuộn được và không tràn", async ({ page }) => {
  await page.setViewportSize({width:390,height:844});
  await page.goto("/footer");
  await page.locator("#footer-tagline").click();
  const toolbar = await page.getByRole("toolbar").boundingBox();
  const field = await page.locator("#footer-tagline").boundingBox();
  expect(toolbar!.y).toBeGreaterThanOrEqual(0);
  expect(toolbar!.y+toolbar!.height).toBeLessThanOrEqual(field!.y);
  expect(toolbar!.x+toolbar!.width).toBeLessThanOrEqual(390);
  await page.screenshot({path:"test-results/footer-mobile.png",fullPage:true});
});

const homeCases = [
  { key: "home.hero", field: "line1", text: "Tiêu đề thử", block: false },
  { key: "home.productFamilies", field: "title", text: "Tiêu đề thử", block: true },
  { key: "home.brandStrip", field: "items-0-label", text: "Tiêu đề thử", block: false },
  { key: "home.scienceEmotion", field: "panels-0-concepts", text: "SKIN | MIND", block: true },
  { key: "home.skinScience", field: "benefits", text: "Công dụng thử", block: true },
  { key: "home.ritual", field: "startLabel", text: "Bắt đầu mới", block: false },
  { key: "home.journal", field: "cards-0-intro", text: "Đọc thêm thử", block: true },
  { key: "home.newsletter", field: "thankYou", text: "Cảm ơn bạn", block: true },
];

for (const item of homeCases) {
  test(`Trang chủ ${item.key}: định dạng, lưu và hiển thị bằng component thật`, async ({page}) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.goto("/home");
    await page.getByLabel("Khối Trang chủ", {exact:true}).selectOption(item.key);
    const field = `#home-${item.field}`;
    const editor = page.locator(field);
    await editor.fill(item.text);
    await selectText(page,0,item.text.length,field);
    await expect(page.getByRole("button", {name:"Gạch chân",exact:true})).toHaveCount(item.block ? 1 : 0);
    await page.getByRole("button", {name:"In đậm",exact:true}).click();
    if (item.key === "home.journal") {
      await page.getByRole("button", {name:"Chèn link",exact:true}).click();
      await page.getByRole("textbox",{name:"Đường dẫn liên kết",exact:true}).fill("https://example.com/intro");
      await page.getByRole("button",{name:"Áp dụng",exact:true}).click();
    }
    if (item.key === "home.productFamilies") {
      await page.locator("#home-categories-0-alt").fill("");
      await page.locator("#home-categories-0-label").fill("Loại mới");
      await selectText(page,0,4,"#home-categories-0-label");
      await page.getByRole("button",{name:"In đậm",exact:true}).click();
    }
    await page.getByRole("button",{name:"Lưu thay đổi",exact:true}).click();
    await expect(page.getByRole("status").first()).toContainText("Đã lưu bản thử",{timeout:45000});
    const preview = page.frameLocator("#home-preview-frame").getByTestId("home-component");
    await expect(preview).toBeVisible({timeout:45000});
    if (item.key === "home.newsletter") {
      await preview.getByRole("textbox",{name:"Email của bạn",exact:true}).fill("test@example.com");
      await preview.getByRole("button",{name:"ĐĂNG KÝ",exact:true}).click();
      await expect(preview.getByRole("status").locator("strong")).toHaveText(item.text);
    } else if (item.key === "home.scienceEmotion") {
      await expect(preview.locator("strong")).toHaveText(["SKIN", "MIND"]);
      await expect(preview).not.toContainText("dopamind-richtext");
    } else if (item.key === "home.productFamilies") {
      await expect(preview.getByRole("heading",{level:2}).locator("strong")).toHaveText(item.text);
      await expect(preview.getByRole("img",{name:"Loại mới",exact:true})).toHaveAttribute("alt","Loại mới");
    } else {
      await expect(preview.locator("strong")).toHaveText(item.text);
    }
    await expect(preview.locator("h1 p,h2 p,h3 p,p div")).toHaveCount(0);
    if (item.key === "home.journal") {
      const link = preview.getByRole("link",{name:item.text,exact:true});
      await expect(link).toHaveAttribute("href","https://example.com/intro");
      await page.route("https://example.com/intro",route=>route.fulfill({contentType:"text/html",body:"Link nội dung hoạt động"}));
      await link.click();
      await expect.poll(() => page.frames().some(frame=>frame.url()==="https://example.com/intro")).toBe(true);
    } else if (item.key !== "home.newsletter") {
      await editor.fill("Chưa lưu");
      await page.getByRole("button",{name:"Hoàn tác",exact:true}).click();
      await expect(editor.locator("strong")).toHaveText(item.text);
    }
    expect(errors).toEqual([]);
  });
}

test("Trang chủ: bộ đếm 15 phút vẫn bắt đầu, tạm dừng, tiếp tục và đặt lại", async ({page}) => {
  await page.clock.install();
  await page.goto("/home");
  await page.getByLabel("Khối Trang chủ",{exact:true}).selectOption("home.ritual");
  await page.getByRole("button",{name:"Lưu thay đổi",exact:true}).click();
  await expect(page.getByRole("status").first()).toContainText("Đã lưu bản thử",{timeout:45000});
  const preview = page.frameLocator("#home-preview-frame").getByTestId("home-component");
  await expect(preview).toBeVisible({timeout:45000});
  await expect(preview).toContainText("15:00");
  await preview.getByRole("button",{name:"BẮT ĐẦU RESET",exact:true}).click();
  await page.clock.runFor(1100);
  await expect(preview).toContainText("14:59");
  await preview.getByRole("button",{name:"TẠM DỪNG",exact:true}).click();
  await page.clock.fastForward(5000);
  await expect(preview).toContainText("14:59");
  await preview.getByRole("button",{name:"TIẾP TỤC",exact:true}).click();
  await page.clock.runFor(1000);
  await expect(preview).toContainText("14:58");
  await preview.getByRole("button",{name:"ĐẶT LẠI",exact:true}).click();
  await expect(preview).toContainText("15:00");
});

test("Trang chủ điện thoại: đủ 8 khối, ô kỹ thuật không có toolbar, hiển thị không tràn", async ({page}) => {
  await page.setViewportSize({width:390,height:844});
  await page.emulateMedia({reducedMotion:"reduce"});
  await page.goto("/home");
  await expect(page.locator("#home-section option")).toHaveCount(8);
  await page.getByLabel("Khối Trang chủ",{exact:true}).selectOption("home.newsletter");
  await page.locator("#home-placeholder").click();
  await expect(page.getByRole("toolbar")).toHaveCount(0);
  await page.locator("#home-body").fill("Chăm sóc dịu dàng");
  await selectText(page,0,8,"#home-body");
  await page.getByRole("button",{name:"In nghiêng",exact:true}).click();
  await page.getByRole("button",{name:"Lưu thay đổi",exact:true}).click();
  await expect(page.getByRole("status").first()).toContainText("Đã lưu bản thử",{timeout:45000});
  await expect(page.frameLocator("#home-preview-frame").getByTestId("home-component").locator("em")).toHaveText("Chăm sóc",{timeout:45000});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
  await page.locator("#home-preview-frame").screenshot({path:"test-results/home-component-mobile.png"});
  await page.screenshot({path:"test-results/home-mobile.png",fullPage:true});
});

test("Trang chủ: tiêu đề nhiều dòng giữ xuống dòng, bộ đếm và danh sách trong heading hợp lệ", async ({page}) => {
  await page.goto("/home");
  await page.getByLabel("Khối Trang chủ",{exact:true}).selectOption("home.productFamilies");
  const editor = page.locator("#home-title");
  await editor.fill("Một");
  await editor.press("End"); await editor.press("Enter"); await page.keyboard.type("Hai");
  await expect(page.locator("#home-title-count")).toHaveText("7/120");
  await selectText(page,0,6,"#home-title");
  await page.getByRole("button",{name:"In đậm",exact:true}).click();
  await page.getByRole("button",{name:"Lưu thay đổi",exact:true}).click();
  await expect(page.getByRole("status").first()).toContainText("Đã lưu bản thử",{timeout:45000});
  const heading = page.frameLocator("#home-preview-frame").getByRole("heading",{level:2});
  await expect(heading.locator("strong")).toHaveText(["Một","Hai"],{timeout:45000});
  await expect(heading.locator("p,div")).toHaveCount(0);
  const lines = await heading.locator('span[style*="display:block"]').all();
  const first = await lines[0].boundingBox(), second = await lines[1].boundingBox();
  expect(second!.y).toBeGreaterThan(first!.y);
  await selectText(page,0,6,"#home-title");
  await page.getByRole("button",{name:"1. Danh sách",exact:true}).click();
  await expect(page.locator("#home-title-count")).toHaveText("7/120");
  await page.getByRole("button",{name:"Lưu thay đổi",exact:true}).click();
  await expect(page.getByRole("status").first()).toContainText("Đã lưu bản thử",{timeout:45000});
  const list = page.frameLocator("#home-preview-frame").getByRole("list");
  await expect(list).toHaveCSS("list-style-type","decimal",{timeout:45000});
  await expect(list.getByRole("listitem")).toHaveText(["Một","Hai"]);
});

for (const item of [
 {key:"story.hero",field:"body"},{key:"story.meaning",field:"title"},{key:"story.pillars",field:"pillars-0-body"},{key:"story.origin",field:"concepts-0-body"},{key:"story.closing",field:"quote"},{key:"story.cta",field:"body"},
 {key:"shop.hero",field:"body"},{key:"journal.notes",field:"notes-0-body"},{key:"blog.hero",field:"body"},{key:"blog.featured",field:"body"},{key:"blog.posts",field:"posts-0-desc"},{key:"blog.closing",field:"quote"}
]) test("Nhóm còn lại: "+item.key+" lưu, hoàn tác và hiển thị",async({page})=>{
 const errors:string[]=[];page.on("pageerror",e=>errors.push(e.message));
 await page.goto("/all");await page.getByLabel("Khối nội dung",{exact:true}).selectOption(item.key);
 const selector="#home-"+item.field,editor=page.locator(selector),text="Định dạng tiếng Việt";
 await editor.fill(text);await selectText(page,0,text.length,selector);await page.getByRole("button",{name:"In đậm",exact:true}).click();
 await page.getByRole("button",{name:"Lưu thay đổi",exact:true}).click();
 await expect(page.getByRole("status").first()).toContainText("Đã lưu bản thử",{timeout:45000});
 const preview=page.frameLocator("#home-preview-frame").getByTestId("home-component");
 await expect(preview.locator("strong").filter({hasText:text}).first()).toHaveText(text,{timeout:45000});
 await expect(preview).not.toContainText("dopamind-richtext");await expect(preview.locator("h1 p,h2 p,h3 p,p div,a a")).toHaveCount(0);
 await editor.fill("Chưa lưu");await page.getByRole("button",{name:"Hoàn tác",exact:true}).click();await expect(editor.locator("strong")).toHaveText(text);
 await page.getByRole("button",{name:"Khôi phục nội dung gốc",exact:true}).click();await expect(editor).not.toContainText(text);
 expect(errors).toEqual([]);
});

for(const item of [{kind:"article",id:"article-title",key:"title"},{kind:"product",id:"name_vi",key:"name_vi"},{kind:"category",id:"category-name_vi",key:"name_vi"}]) test("Form thật: "+item.kind+" gửi chữ thuần và giữ định dạng riêng",async({page})=>{
 const errors:string[]=[];page.on("pageerror",e=>errors.push(e.message));
 await page.goto("/entities");await page.getByLabel("Loại nội dung",{exact:true}).selectOption(item.kind);
 const selector="#"+item.id;await page.locator(selector).fill("Chữ thử tiếng Việt");await selectText(page,0,7,selector);await page.getByRole("button",{name:"In đậm",exact:true}).click();
 const slug=page.locator('input[name="slug"]');await slug.click();await expect(page.getByRole("toolbar")).toHaveCount(0);
 await page.locator('button[type="submit"]').click();
 await expect(page.getByTestId("entity-preview").locator('[data-field="'+item.key+'"] strong')).toHaveText("Chữ thử");
 await expect(page.getByTestId("canonical")).not.toContainText("dopamind-richtext");
 expect(errors).toEqual([]);
});

for(const def of SECTION_DEFS.filter(d=>!["global","home"].includes(d.group))) test("Đủ mọi ô hiển thị: "+def.key,async({page})=>{
 const values=structuredClone(def.defaults),tokens:string[]=[];
 for(const field of def.fields){const fields=field.type==="list"?field.fields:[field];for(const sub of fields){if(!sub.format)continue;const token="ThửÔ"+(tokens.length+1);tokens.push(token);const value=serializeRichText("<p><strong>"+token+"</strong></p>",sub.format);if(field.type==="list"){const rows=values[field.key] as Record<string,string|number|boolean>[];if(rows[0])rows[0][sub.key]=value;}else values[field.key]=value;}}
 await page.goto("/all/view?section="+encodeURIComponent(def.key)+"&content="+encodeURIComponent(JSON.stringify(values)));
 const root=page.getByTestId("home-component");await expect(root).toBeVisible();
 for(const token of tokens)await expect(root.locator("strong").filter({hasText:new RegExp("^"+token+"$")}).first()).toHaveText(token);
 await expect(root).not.toContainText("dopamind-richtext");await expect(root.locator("h1 p,h2 p,h3 p,p div,a a")).toHaveCount(0);
});

test("Bài cũ: mở form không sửa Markdown; sửa vùng chọn giữ heading và danh sách",async({page})=>{
 await page.goto("/entities");
 const original=await page.locator('input[name="content_markdown"]').inputValue();expect(original).toContain("## Tiêu đề cũ");
 await expect(page.locator("#article-content h2")).toHaveText("Tiêu đề cũ");await expect(page.locator("#article-content ul li")).toHaveCount(2);
 await page.locator("#article-title").fill("Đổi tiêu đề");expect(await page.locator('input[name="content_markdown"]').inputValue()).toBe(original);
 await selectText(page,0,7,"#article-content");await page.getByRole("button",{name:"In nghiêng",exact:true}).click();
 await expect(page.locator("#article-content h2 em")).toHaveText("Tiêu đề");await expect(page.locator("#article-content ul li")).toHaveCount(2);
 await page.locator('button[type="submit"]').click();await expect(page.getByTestId("entity-preview").locator("h2 em").first()).toHaveText("Tiêu đề");
});

test("Website thật: danh mục, sản phẩm, tab mô tả và nội dung bài có định dạng",async({page})=>{
 await page.goto("/entities/public");for(const text of ["Danh mục","Ngắn","Mô tả danh mục","Sản phẩm","Mô tả ngắn","Chi tiết sản phẩm"])await expect(page.locator("strong").filter({hasText:new RegExp("^"+text+"$")}).first()).toHaveText(text);
 await page.getByRole("button",{name:"Ngắn",exact:true}).click();await expect(page.getByRole("heading",{name:"Sản phẩm",exact:true})).toBeVisible();
 await expect(page.getByTestId("article-body").locator("h2 em")).toHaveText("Tiêu đề bài");await expect(page.getByTestId("article-body").locator("ul li")).toHaveText("Một ý");
 await expect(page.locator("h1 p,h2 p,h3 p,p div,a a")).toHaveCount(0);
});
