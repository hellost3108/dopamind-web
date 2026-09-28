"use client";

import { useState } from "react";
import Link from "next/link";
import { Noto_Serif_Display, Be_Vietnam_Pro } from "next/font/google";
import "./bai-viet.css";
const serif = Noto_Serif_Display({ subsets: ["latin", "vietnamese"], style: ["normal", "italic"], display: "swap" });
const sans = Be_Vietnam_Pro({ subsets: ["latin", "vietnamese"], weight: ["300", "400", "500", "600"], display: "swap" });

type Post = {
  cat: string;
  title: string;
  desc: string;
  date: string;
  label: string;
  min: number;
  art: string;
  href: string;
};

// Thêm hoặc sửa bài viết ở đây. Đổi href khi đã có trang chi tiết.
const POSTS: Post[] = [
  { cat: "Skin Science", title: "Hàng rào bảo vệ da thực sự là gì?", desc: "Hiểu đúng về hàng rào bảo vệ da để chăm sóc da khỏe mạnh và bền vững hơn mỗi ngày.", date: "2024-05-10", label: "10 Tháng 5, 2024", min: 5, art: "p1", href: "#" },
  { cat: "Mask Technology", title: "Điều gì tạo nên một chiếc mask khác biệt?", desc: "Không chỉ là miếng mask, mà là sự kết hợp giữa khoa học, chất liệu và trải nghiệm cảm xúc.", date: "2024-05-08", label: "8 Tháng 5, 2024", min: 6, art: "p2", href: "#" },
  { cat: "Mind Reset", title: "Khi tâm trí dịu lại, làn da cũng rạng rỡ hơn", desc: "Một làn da đẹp bắt đầu từ một tâm trí bình yên. Cùng khám phá nghệ thuật sống chậm.", date: "2024-05-05", label: "5 Tháng 5, 2024", min: 4, art: "p3", href: "#" },
  { cat: "Skin Science", title: "Những hoạt chất vàng trong chăm sóc da hiện đại", desc: "Từ Niacinamide đến Peptide, khám phá các thành phần đang tạo nên làn da khỏe đẹp hơn.", date: "2024-04-28", label: "28 Tháng 4, 2024", min: 5, art: "p4", href: "#" },
  { cat: "Mind Reset", title: "5 nghi thức nhỏ giúp bạn sống chậm mỗi ngày", desc: "Những thay đổi nhỏ trong thói quen có thể tạo nên phiên bản dịu dàng và hạnh phúc hơn.", date: "2024-04-24", label: "24 Tháng 4, 2024", min: 4, art: "p5", href: "#" },
  { cat: "Mask Technology", title: "Tương lai của mặt nạ: Cá nhân hóa trải nghiệm", desc: "Công nghệ đang mở ra một kỷ nguyên mới cho trải nghiệm chăm sóc da tại nhà.", date: "2024-04-20", label: "20 Tháng 4, 2024", min: 5, art: "p6", href: "#" },
];

const FILTERS = ["Tất cả", "Skin Science", "Mind Reset", "Mask Technology"];

export default function BaiVietPage() {
  const [filter, setFilter] = useState("Tất cả");
  const [sort, setSort] = useState<"new" | "old">("new");
  const [sent, setSent] = useState(false);

  const list = POSTS.filter((p) => filter === "Tất cả" || p.cat === filter).sort(
    (a, b) => (sort === "new" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date))
  );

  return (
    <div className={`bv ${sans.className}`} style={{ "--serif": serif.style.fontFamily, "--sans": sans.style.fontFamily } as React.CSSProperties}>
      <section className="hero">
        <div className="wrap">
          <div>
            <h1>
              Những điều tốt đẹp bắt đầu <em>từ sự dịu dàng.</em>
            </h1>
            <p>Khám phá những câu chuyện, kiến thức và cảm hứng về làn da, tâm trí và một nhịp sống cân bằng hơn.</p>
            <a className="btn" href="#bai-viet">Khám phá bài viết</a>
            <div className="tags">Kiến thức / Cảm hứng / Rituals / Vì một làn da hạnh phúc</div>
          </div>
          {/* Thay khối này bằng ảnh hero khi có ảnh */}
          <div className="art" aria-hidden="true">
            <i className="orb a" />
            <i className="orb b" />
            <i className="orb c" />
          </div>
        </div>
      </section>

      <section className="feat">
        <div className="wrap box">
          <div>
            <div className="eyebrow">Nổi bật</div>
            <h2>Làn da cũng cần được nghỉ ngơi</h2>
            <p>Khi bạn cho phép mình chậm lại, làn da cũng có cơ hội được phục hồi. Khám phá mối liên kết diệu kỳ giữa nghỉ ngơi, cảm xúc và sức khỏe làn da.</p>
            <Link className="btn sm" href="#">Đọc bài viết</Link>
            <div className="meta" style={{ marginTop: 22 }}>
              <span>12 Tháng 5, 2024</span>
              <span>6 phút đọc</span>
            </div>
          </div>
          <div className="thumb pf" role="img" aria-label="Ảnh bài viết nổi bật" />
        </div>
      </section>

      <section className="wrap" id="bai-viet">
        <div className="bar">
          <div className="chips" role="group" aria-label="Lọc theo chủ đề">
            {FILTERS.map((f) => (
              <button key={f} className="chip" aria-pressed={filter === f} onClick={() => setFilter(f)}>
                {f}
              </button>
            ))}
          </div>
          <label className="sort">
            Sắp xếp:{" "}
            <select value={sort} onChange={(e) => setSort(e.target.value as "new" | "old")}>
              <option value="new">Mới nhất</option>
              <option value="old">Cũ nhất</option>
            </select>
          </label>
        </div>

        <div className="grid">
          {list.length === 0 && <p className="empty">Chưa có bài viết trong chủ đề này. Hãy thử chọn “Tất cả”.</p>}
          {list.map((p) => (
            <article className="card" key={p.title}>
              <Link href={p.href}>
                {/* Có ảnh thật: thay dòng dưới bằng <div className="thumb"><img src="/images/bai-viet/ten-anh.jpg" alt={p.title} /></div> */}
                <div className={`thumb ${p.art}`} role="img" aria-label={p.title} />
                <span className="cat">{p.cat}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <div className="meta">
                  <div>
                    <span>{p.label}</span>
                    <span>{p.min} phút đọc</span>
                  </div>
                  <span className="go" aria-hidden="true">→</span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="quote">
        <div className="wrap">
          <blockquote>
            “Một làn da đẹp là kết quả của một tâm trí bình yên.”
            <cite>DOPAMIND</cite>
          </blockquote>
        </div>
      </section>

      <section className="cta">
        <div className="wrap">
          <div>
            <div className="eyebrow">Từ những câu chuyện đến trải nghiệm thật</div>
            <h2>Biến tri thức thành nghi thức chăm da.</h2>
            <p>Khám phá bộ sưu tập mặt nạ DOPAMIND, nơi khoa học và cảm xúc gặp nhau, cho một làn da rạng rỡ và một bạn phiên bản thư thái hơn mỗi ngày.</p>
            <Link className="btn sm" href="/san-pham">Khám phá sản phẩm</Link>
          </div>
          <div className="packs" aria-hidden="true">
            <i /><i /><i /><i />
          </div>
        </div>
      </section>

      <section className="news">
        <div className="wrap">
          <div>
            <h2>Nhận cảm hứng mỗi tuần.</h2>
            <p>Đăng ký để nhận những bài viết mới nhất, bí quyết chăm da và những câu chuyện truyền cảm hứng từ DOPAMIND.</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
            <input type="email" placeholder="Email của bạn" aria-label="Email của bạn" required />
            <button className="btn" type="submit">{sent ? "Đã đăng ký" : "Đăng ký"}</button>
            <label>
              <input type="checkbox" required /> Tôi đồng ý nhận email từ DOPAMIND. Bạn có thể hủy đăng ký bất cứ lúc nào.
            </label>
          </form>
        </div>
      </section>
    </div>
  );
}
