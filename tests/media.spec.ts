import {expect,test,type Page} from "@playwright/test";
import type {MediaPlacement,MediaTrash} from "../src/lib/media/types";
const oldUrl="/images/homepage/hero/H02.png",newUrl="/images/homepage/hero/H01.png";
async function mockLibrary(page:Page){
  const asset={id:"11111111-1111-4111-8111-111111111111",name:"Ảnh thương hiệu.png",alt:"Ảnh thương hiệu",url:newUrl,width:1920,height:1440,bytes:1200,original_bucket:"brand-originals",original_path:"test.png",variants:[{width:1920,height:1440,path:"test.webp",url:newUrl}],created_at:new Date().toISOString(),deleted_at:null};
  const placements:Record<string,MediaPlacement>={},trash:MediaTrash[]=[];
  await page.route("**/api/admin/media**",async route=>{
    if(route.request().method()==="GET"){await route.fulfill({json:{assets:[{...asset,usedIn:Object.values(placements).some(p=>!p.disabled)?["Trang chủ — Hero"]:[]}],total:1,page:0,placements,trash:trash.filter(t=>!t.restored_at),slots:[{key:"home.hero.mobile",page:"Trang chủ",label:"Hero điện thoại",href:"/",url:oldUrl,alt:"Ảnh gốc",advice:"4:5, 960 × 1200 px."}]}});return;}
    const input=route.request().postDataJSON(),slot="home.hero.mobile";
    if(input.operation==="save"){placements[slot]={...input,url:input.asset_id?newUrl:oldUrl,updated_at:new Date().toISOString()};}
    else if(input.operation==="delete"){const date=new Date().toISOString();trash.push({id:"trash-1",slot,asset_id:asset.id,snapshot:structuredClone(placements[slot]),deleted_at:date,restored_at:null});placements[slot]={...placements[slot],disabled:true,updated_at:date};}
    else if(input.operation==="restore"){const item=trash.find(t=>t.id===input.id)!;placements[slot]={...item.snapshot as MediaPlacement,disabled:false,updated_at:new Date().toISOString()};item.restored_at=new Date().toISOString();}
    else if(input.operation==="reset")delete placements[slot];
    await route.fulfill({json:{ok:true}});
  });
  return {placements,trash};
}
async function chooseImage(page:Page){await page.getByRole("button",{name:"Chọn từ thư viện",exact:true}).click();const dialog=page.getByRole("dialog",{name:"Chọn ảnh từ thư viện"});await dialog.getByRole("button",{name:"Chọn ảnh này",exact:true}).click();}

test("font chỉ có bốn mục, xem trước từng font, giữ độ đậm và font dự phòng khi lưu",async({page})=>{
  await page.goto("/");await page.locator("#announcement").fill("Tiếng Việt Ắ ễ ự");
  await page.locator("#announcement").press("ControlOrMeta+a");
  const font=page.getByLabel("Font chữ",{exact:true});
  await expect(font.locator("option")).toHaveText(["Font hiện tại","Libre Caslon Display","Montserrat ExtraBold","Be Vietnam Pro Regular","Be Vietnam Pro Medium"]);
  for(const [id,weight]of [["libre-caslon-400","400"],["montserrat-800","800"],["be-vietnam-400","400"],["be-vietnam-500","500"]]){
    await page.locator("#announcement").press("ControlOrMeta+a");await font.selectOption(id);await expect(page.locator("#announcement span[style]").first()).toHaveCSS("font-weight",weight);
    await expect(font.locator(`option[value="${id}"]`)).toHaveCSS("font-weight",weight);
  }
  await page.getByRole("button",{name:"Lưu thay đổi",exact:true}).click();await expect(page.getByTestId("public-preview")).toContainText("Tiếng Việt Ắ ễ ự");
  await expect(page.getByTestId("public-preview").locator("span[style]")).toHaveCSS("font-weight","500");await expect(page.getByTestId("public-preview").locator("span[style]")).toHaveCSS("font-family",/Be Vietnam Pro/);
});
test("ảnh chọn từ thư viện chỉ thay sau Lưu; alt, lấy nét máy tính/điện thoại và Hoàn tác hoạt động",async({page})=>{
  await mockLibrary(page);await page.goto("/media");await chooseImage(page);
  const output=page.getByTestId("public-media");await expect(output.locator("img")).toHaveAttribute("src",oldUrl);
  await page.getByRole("textbox",{name:"Mô tả ảnh (alt) tiếng Việt",exact:true}).fill("Nghi thức thư giãn");
  await page.getByRole("slider",{name:"Máy tính ngang",exact:true}).press("End");
  await page.getByRole("button",{name:"Điểm lấy nét điện thoại",exact:true}).click();await page.getByRole("slider",{name:"Điện thoại ngang",exact:true}).press("Home");
  await page.getByRole("button",{name:"Lưu ảnh",exact:true}).click();await expect(output.locator("img")).toHaveAttribute("src",newUrl);await expect(output.locator("img")).toHaveAttribute("alt","Nghi thức thư giãn");await expect(output.locator("img")).toHaveCSS("object-position","100% 50%");
  await page.setViewportSize({width:390,height:844});await expect(output.locator("img")).toHaveCSS("object-position","0% 50%");
  await page.getByRole("textbox",{name:"Mô tả ảnh (alt) tiếng Việt",exact:true}).fill("Chưa lưu");await page.getByRole("button",{name:"Hoàn tác ảnh",exact:true}).click();await expect(page.getByRole("textbox",{name:"Mô tả ảnh (alt) tiếng Việt",exact:true})).toHaveValue("Nghi thức thư giãn");
});
test("xóa có xác nhận, đi vào thùng rác, khôi phục đúng ảnh và khôi phục ảnh gốc",async({page})=>{
  await mockLibrary(page);await page.goto("/media");await chooseImage(page);await page.getByRole("button",{name:"Lưu ảnh",exact:true}).click();
  page.once("dialog",dialog=>dialog.dismiss());await page.getByRole("button",{name:"Xóa ảnh",exact:true}).first().click();await expect(page.getByTestId("image-editor").first().getByTestId("original-image")).toBeVisible();
  page.once("dialog",dialog=>dialog.accept());await page.getByRole("button",{name:"Xóa ảnh",exact:true}).first().click();await page.getByRole("button",{name:"Lưu ảnh",exact:true}).click();await expect(page.getByTestId("public-media").locator("img")).toHaveCount(0);
  await page.getByRole("button",{name:"Thùng rác",exact:true}).click();await page.getByRole("button",{name:"Khôi phục ảnh",exact:true}).click();await page.reload();await expect(page.getByTestId("public-media").locator("img")).toHaveAttribute("src",newUrl);
  await page.getByRole("button",{name:"Khôi phục ảnh gốc",exact:true}).click();await page.getByRole("button",{name:"Lưu ảnh",exact:true}).click();await expect(page.getByTestId("public-media").locator("img")).toHaveAttribute("src",oldUrl);
});
test("thư viện tìm theo tên, cho biết nơi đang dùng và chọn lại ảnh",async({page})=>{
  const state=await mockLibrary(page);state.placements["home.hero.mobile"]={slot:"home.hero.mobile",asset_id:"11111111-1111-4111-8111-111111111111",url:newUrl,alt:"Ảnh mới",desktop:{x:50,y:50},mobile:{x:50,y:50},disabled:false};
  await page.goto("/media");await expect(page.getByText("Đang dùng: Trang chủ — Hero",{exact:true})).toBeVisible();await page.getByRole("textbox",{name:"Tìm ảnh theo tên",exact:true}).fill("thương hiệu");await expect(page.getByText("Ảnh thương hiệu.png",{exact:true})).toBeVisible();
  await page.getByRole("textbox",{name:"Tìm ảnh theo tên",exact:true}).fill("");await page.getByRole("button",{name:"Vị trí ảnh trên website",exact:true}).click();await expect(page.getByRole("button",{name:/Trang chủ — Hero điện thoại/})).toBeVisible();
});
test("ảnh lỗi hiển thị khung giữ chỗ; lỗi quyền từ máy chủ hiển thị tiếng Việt",async({page})=>{
  await page.route("**/api/admin/media**",route=>route.fulfill({status:401,json:{error:"Bạn cần đăng nhập tài khoản biên tập để quản lý ảnh."}}));await page.goto("/media");await expect(page.getByRole("alert").first()).toContainText("Bạn cần đăng nhập");
});


test("xem toàn bộ ảnh đúng tỉ lệ, dấu lấy nét bám ảnh và hai vùng cắt cập nhật ngay",async({page})=>{
  await mockLibrary(page);await page.goto("/media");
  const editor=page.getByTestId("image-editor").first(),frame=editor.getByTestId("image-editor-dropzone"),image=editor.getByTestId("original-image");
  await expect(frame).toHaveAttribute("data-ratio","0.8");await expect(image).toHaveCSS("object-fit","contain");
  await image.evaluate((img:HTMLImageElement)=>img.decode());
  const box=await frame.boundingBox();expect(box!.width/box!.height).toBeCloseTo(.8,1);expect(box!.height).toBeLessThanOrEqual(421);
  await editor.getByRole("slider",{name:"Máy tính ngang",exact:true}).press("End");
  await expect(editor.getByTestId("focus-marker")).toHaveAttribute("aria-label","Điểm lấy nét 100% ngang, 50% dọc");
  await expect(editor.getByTestId("website-preview-desktop")).toHaveCSS("object-position","100% 50%");
  await editor.getByRole("button",{name:"Điểm lấy nét điện thoại",exact:true}).click();await editor.getByRole("slider",{name:"Điện thoại dọc",exact:true}).press("Home");
  await expect(editor.getByTestId("website-preview-mobile")).toHaveCSS("object-position","50% 0%");
  await image.click({position:{x:box!.width/2,y:box!.height/2}});
  await expect(editor.getByTestId("focus-marker")).toHaveAttribute("aria-label",/50% ngang, 50% dọc/);
  await chooseImage(page);await image.evaluate((img:HTMLImageElement)=>img.decode());
  const natural=await image.evaluate((img:HTMLImageElement)=>img.naturalWidth/img.naturalHeight);
  const h=Math.min(1,.8/natural),w=Math.min(1,natural/.8);
  await image.click({position:{x:box!.width*((1-w)/2+w*.25),y:box!.height*((1-h)/2+h*.75)}});
  await expect(editor.getByTestId("focus-marker")).toHaveAttribute("aria-label",/25% ngang, 75% dọc/);
  if(h<.9){await image.click({position:{x:box!.width/2,y:1}});await expect(editor.getByTestId("focus-marker")).toHaveAttribute("aria-label",/25% ngang, 75% dọc/);}
  await page.setViewportSize({width:390,height:844});const phone=await frame.boundingBox();expect(phone!.width/phone!.height).toBeCloseTo(.8,1);expect(phone!.height).toBeLessThanOrEqual(423);
});
