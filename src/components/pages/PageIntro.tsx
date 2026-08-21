import type { ReactNode } from "react";

export function PageIntro({ eyebrow, title, body, aside }: { eyebrow: string; title: ReactNode; body: string; aside?: ReactNode }) {
  return (
    <section className="border-b border-charcoal/10 px-[clamp(20px,4vw,64px)] py-[clamp(72px,10vw,150px)]">
      <div className="mx-auto grid max-w-[1600px] gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(260px,.6fr)] lg:items-end">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[.2em] text-charcoal/50">{eyebrow}</p>
          <h1 className="mt-5 max-w-5xl text-[clamp(3rem,8vw,8.5rem)] font-medium uppercase leading-[.86] tracking-[-.065em] text-charcoal">{title}</h1>
        </div>
        <div className="max-w-md lg:justify-self-end">
          <p className="text-[clamp(1rem,1.4vw,1.25rem)] leading-relaxed text-charcoal/65">{body}</p>
          {aside && <div className="mt-7">{aside}</div>}
        </div>
      </div>
    </section>
  );
}
