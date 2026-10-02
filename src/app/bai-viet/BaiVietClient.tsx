"use client";

import { useState } from "react";
import Link from "next/link";
import { Noto_Serif_Display, Be_Vietnam_Pro } from "next/font/google";
import "./bai-viet.css";
const serif = Noto_Serif_Display({ subsets: ["latin", "vietnamese"], style: ["normal", "italic"], display: "swap" });
const sans = Be_Vietnam_Pro({ subsets: ["latin", "vietnamese"], weight: ["300", "400", "500", "600"], display: "swap" });

export type BlogPost = {
  cat: string;
  title: string;
  desc: string;
  date: string;
  label: string;
  min: number;
  art: string;
  href: string;
  image: string;
};

export type BlogContent = {
  hero: { title: string; titleEm: string; body: string; ctaLabel: string; tags: string };
  featured: {
    eyebrow: string;
    title: string;
    body: string;
    ctaLabel: string;
    href: string;
    dateLabel: string;
    minutes: number;
    image: string;
  };
  posts: BlogPost[];
  closing: {
    quote: string;
    quoteAuthor: string;
    ctaEyebrow: string;
    ctaTitle: string;
    ctaBody: string;
    ctaLabel: string;
    ctaHref: string;
    newsTitle: string;
    newsBody: string;
  };
};

export default function BaiVietClient({ content }: { content: BlogContent }) {
  const { hero, featured, posts: POSTS, closing } = content;
  const FILTERS = ["Tất cả", ...Array.from(new Set(POSTS.map((p) => p.cat).filter(Boolean)))];
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
              {hero.title}
              {hero.titleEm && (
                <>
                  {" "}
                  <em>{hero.titleEm}</em>
                </>
              )}
            </h1>
            <p>{hero.body}</p>
            {hero.ctaLabel && <a className="btn" href="#bai-viet">{hero.ctaLabel}</a>}
            {hero.tags && <div className="tags">{hero.tags}</div>}
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
            <div className="eyebrow">{featured.eyebrow}</div>
            <h2>{featured.title}</h2>
            <p>{featured.body}</p>
            {featured.ctaLabel && <Link className="btn sm" href={featured.href || "#"}>{featured.ctaLabel}</Link>}
            <div className="meta" style={{ marginTop: 22 }}>
              {featured.dateLabel && <span>{featured.dateLabel}</span>}
              {featured.minutes > 0 && <span>{featured.minutes} phút đọc</span>}
            </div>
          </div>
          {featured.image ? (
            <div className="thumb">
              {/* eslint-disable-next-line @next/next/no-img-element -- ảnh do admin nhập, có thể ở bất kỳ host nào */}
              <img src={featured.image} alt={featured.title} />
            </div>
          ) : (
            <div className="thumb pf" role="img" aria-label="Ảnh bài viết nổi bật" />
          )}
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
            <article className="card" key={`${p.title}-${p.date}`}>
              <Link href={p.href || "#"}>
                {p.image ? (
                  <div className="thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element -- ảnh do admin nhập, có thể ở bất kỳ host nào */}
                    <img src={p.image} alt={p.title} />
                  </div>
                ) : (
                  <div className={`thumb ${p.art}`} role="img" aria-label={p.title} />
                )}
                <span className="cat">{p.cat}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <div className="meta">
                  <div>
                    <span>{p.label}</span>
                    {p.min > 0 && <span>{p.min} phút đọc</span>}
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
            {closing.quote}
            {closing.quoteAuthor && <cite>{closing.quoteAuthor}</cite>}
          </blockquote>
        </div>
      </section>

      <section className="cta">
        <div className="wrap">
          <div>
            <div className="eyebrow">{closing.ctaEyebrow}</div>
            <h2>{closing.ctaTitle}</h2>
            <p>{closing.ctaBody}</p>
            {closing.ctaLabel && <Link className="btn sm" href={closing.ctaHref || "/san-pham"}>{closing.ctaLabel}</Link>}
          </div>
          <div className="packs" aria-hidden="true">
            <i /><i /><i /><i />
          </div>
        </div>
      </section>

      <section className="news">
        <div className="wrap">
          <div>
            <h2>{closing.newsTitle}</h2>
            <p>{closing.newsBody}</p>
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
