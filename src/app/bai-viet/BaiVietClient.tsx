"use client";

import { FormattedText } from "@/components/content/FormattedText";

import { readRichText } from "@/lib/rich-text/content";
import {SiteImage} from "@/components/media/SiteImage";
import {useMediaPlacements} from "@/components/media/MediaProvider";
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
  imageSlot?: string;
  imageAlt?: string;
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
    imageSlot?: string;
  imageAlt?: string;
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
  const placements=useMediaPlacements();
  const FILTERS = ["Tất cả", ...Array.from(new Set(POSTS.map((p) => readRichText(p.cat, "inline").text).filter(Boolean)))];
  const [filter, setFilter] = useState("Tất cả");
  const [sort, setSort] = useState<"new" | "old">("new");
  const [sent, setSent] = useState(false);

  const list = POSTS.filter((p) => filter === "Tất cả" || readRichText(p.cat, "inline").text === filter).sort(
    (a, b) => (sort === "new" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date))
  );

  return (
    <div className={`bv ${sans.className}`} style={{ "--serif": serif.style.fontFamily, "--sans": sans.style.fontFamily } as React.CSSProperties}>
      <section className="hero">
        <div className="wrap">
          <div>
            <h1>
              <FormattedText value={hero.title} mode="block" phrasing />
              {hero.titleEm && (
                <>
                  {" "}
                  <em><FormattedText value={hero.titleEm} /></em>
                </>
              )}
            </h1>
            <p><FormattedText value={hero.body} mode="block" phrasing /></p>
            {hero.ctaLabel && <a className="btn" href="#bai-viet"><FormattedText value={hero.ctaLabel} /></a>}
            {hero.tags && <div className="tags"><FormattedText value={hero.tags} mode="block" phrasing /></div>}
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
            <div className="eyebrow"><FormattedText value={featured.eyebrow} /></div>
            <h2><FormattedText value={featured.title} mode="block" phrasing /></h2>
            <p><FormattedText value={featured.body} mode="block" phrasing /></p>
            {featured.ctaLabel && <Link className="btn sm" href={featured.href || "#"}><FormattedText value={featured.ctaLabel} /></Link>}
            <div className="meta" style={{ marginTop: 22 }}>
              {featured.dateLabel && <span><FormattedText value={featured.dateLabel} /></span>}
              {featured.minutes > 0 && <span>{featured.minutes} phút đọc</span>}
            </div>
          </div>
          {featured.image || placements[featured.imageSlot??"cms:blog.featured:image"] ? (
            <div className="thumb">
              <SiteImage native sizes="(min-width:1024px) 55vw, 90vw" slot={featured.imageSlot??"cms:blog.featured:image"} src={featured.image} alt={featured.imageAlt||readRichText(featured.title, "inline").text} />
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
                <FormattedText value={POSTS.find((post) => readRichText(post.cat, "inline").text === f)?.cat ?? f} />
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
            <article className="card relative" key={`${p.title}-${p.date}`}>
              <Link href={p.href || "#"} aria-label={readRichText(p.title,"inline").text} className="absolute inset-0 z-10" />
              <div className="pointer-events-none [&_a]:pointer-events-auto [&_a]:relative [&_a]:z-20">
                {p.image || placements[p.imageSlot??""] ? (
                  <div className="thumb">
                    <SiteImage native sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 90vw" slot={p.imageSlot} src={p.image} alt={p.imageAlt||readRichText(p.title, "inline").text} />
                  </div>
                ) : (
                  <div className={`thumb ${p.art}`} role="img" aria-label={readRichText(p.title, "inline").text} />
                )}
                <span className="cat"><FormattedText value={p.cat} /></span>
                <h3><FormattedText value={p.title} mode="block" phrasing /></h3>
                <p><FormattedText value={p.desc} mode="block" phrasing /></p>
                <div className="meta">
                  <div>
                    <span><FormattedText value={p.label} /></span>
                    {p.min > 0 && <span>{p.min} phút đọc</span>}
                  </div>
                  <span className="go" aria-hidden="true">→</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="quote">
        <div className="wrap">
          <blockquote>
            <FormattedText value={closing.quote} mode="block" phrasing />
            {closing.quoteAuthor && <cite><FormattedText value={closing.quoteAuthor} /></cite>}
          </blockquote>
        </div>
      </section>

      <section className="cta">
        <div className="wrap">
          <div>
            <div className="eyebrow"><FormattedText value={closing.ctaEyebrow} /></div>
            <h2><FormattedText value={closing.ctaTitle} mode="block" phrasing /></h2>
            <p><FormattedText value={closing.ctaBody} mode="block" phrasing /></p>
            {closing.ctaLabel && <Link className="btn sm" href={closing.ctaHref || "/san-pham"}><FormattedText value={closing.ctaLabel} /></Link>}
          </div>
          <div className="packs" aria-hidden="true">
            <i /><i /><i /><i />
          </div>
        </div>
      </section>

      <section className="news">
        <div className="wrap">
          <div>
            <h2><FormattedText value={closing.newsTitle} mode="block" phrasing /></h2>
            <p><FormattedText value={closing.newsBody} mode="block" phrasing /></p>
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
