"use client";

import { useState } from "react";
import Image from "next/image";

export function ProductGallery({
  images,
  name,
}: {
  images: { url: string; alt: string }[];
  name: string;
}) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) {
        return (
      <div
        role="img"
        aria-label={`Hình ảnh ${name} sắp cập nhật`}
        className="relative flex aspect-square items-center justify-center bg-lavender/20"
      >
        <span
          aria-hidden="true"
          className="absolute inset-4 border border-charcoal/10"
        />
        <span className="text-[10px] uppercase tracking-[.18em] text-charcoal/40">
          Hình ảnh sắp cập nhật
        </span>
      </div>
    );
  }

  const current = images[index] ?? images[0];
  const hasThumbs = images.length > 1;

  return (
    <div
      className={
        hasThumbs
          ? "flex flex-col-reverse gap-3 md:grid md:grid-cols-[72px_minmax(0,1fr)]"
          : ""
      }
    >
      {hasThumbs && (
        <div className="relative">
          <ul className="flex gap-2 overflow-x-auto md:absolute md:inset-0 md:flex-col md:overflow-x-hidden md:overflow-y-auto">
            {images.map((image, i) => (
              <li key={image.url} className="w-16 shrink-0 md:w-full">
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Xem ảnh ${i + 1} của ${name}`}
                  aria-current={i === index}
                  className={`relative block aspect-square w-full overflow-hidden border-2 transition-colors ${
                    i === index ? "border-charcoal" : "border-transparent"
                  }`}
                >
                  <Image
                    src={image.url}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="relative aspect-square overflow-hidden bg-lavender/20">
        <Image
          key={current.url}
          src={current.url}
          alt={current.alt}
          fill
          priority
          sizes="(min-width: 1181px) 46vw, 100vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}