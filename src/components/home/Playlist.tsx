"use client";

import { useState } from "react";
import { PLAYLISTS, MAIN_PLAYLIST } from "@/lib/playlists";
import { cn } from "@/lib/utils";

function PlaylistIcon(props: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={props.className}
    >
      <path d="M9 18V6l10-2v12" />
      <circle cx="7" cy="18" r="2.2" />
      <circle cx="17" cy="16" r="2.2" />
    </svg>
  );
}

/**
 * Spotify embeds are fully data-driven from src/lib/playlists.ts — no
 * playlist has a real `spotifyEmbedUrl` yet, so every tile renders an
 * honest "coming soon" panel instead of an iframe pointed at a fake or
 * empty src. See CLAUDE.md > PLAYLIST ("No broken iframe.").
 */
export function Playlist() {
  const [activeSlug, setActiveSlug] = useState(MAIN_PLAYLIST.slug);
  const active = PLAYLISTS.find((playlist) => playlist.slug === activeSlug) ?? MAIN_PLAYLIST;

  return (
    <section className="relative bg-cloud-milk py-[clamp(72px,10vh,144px)]">
      <div className="mx-auto max-w-[1600px] px-[clamp(20px,4vw,64px)]">
        <div className="max-w-[38rem]">
          <h2 className="text-[clamp(1.75rem,3.6vw,3.25rem)] font-medium leading-[1.1] tracking-[-0.01em] text-charcoal">
            PLAYLIST DÀNH CHO 15 PHÚT CỦA BẠN
          </h2>
        </div>

        <div className="mt-10 flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(240px,32%)_1fr] lg:items-start lg:gap-12">
          <ul className="[&::-webkit-scrollbar]:hidden -mx-[clamp(20px,4vw,64px)] flex gap-2 overflow-x-auto px-[clamp(20px,4vw,64px)] pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0 lg:pb-0">
            {PLAYLISTS.map((playlist) => {
              const isActive = playlist.slug === activeSlug;
              return (
                <li key={playlist.slug} className="shrink-0 lg:shrink">
                  <button
                    type="button"
                    onClick={() => setActiveSlug(playlist.slug)}
                    aria-pressed={isActive}
                    className={cn(
                      "flex min-h-11 w-full items-center gap-3 whitespace-nowrap px-4 text-left text-xs font-medium tracking-[0.1em] transition-colors duration-200 lg:whitespace-normal lg:px-4",
                      isActive
                        ? "bg-charcoal text-cloud-milk"
                        : "border border-charcoal/15 text-charcoal/65 hover:border-charcoal/40 lg:border-0 lg:hover:bg-charcoal/5"
                    )}
                  >
                    {playlist.labelVi}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="relative w-full overflow-hidden bg-charcoal/[0.04]" style={{ minHeight: "clamp(232px, 30vw, 352px)" }}>
            {active.spotifyEmbedUrl ? (
              <iframe
                key={active.slug}
                src={active.spotifyEmbedUrl}
                title={`Spotify — ${active.labelVi}`}
                loading="lazy"
                allow="encrypted-media"
                className="h-full min-h-[232px] w-full"
                style={{ height: "clamp(232px, 30vw, 352px)" }}
              />
            ) : (
              <div className="flex h-full min-h-[232px] flex-col items-center justify-center gap-3 px-6 py-12 text-center">
                <PlaylistIcon className="h-8 w-8 text-charcoal/30" />
                <span className="text-sm font-medium text-charcoal">{active.labelVi}</span>
                {active.descriptionVi && (
                  <p className="max-w-[26ch] text-sm text-charcoal/55">{active.descriptionVi}</p>
                )}
                <span className="mt-1 text-[11px] uppercase tracking-[0.18em] text-charcoal/40">
                  Sắp có trên Spotify
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
