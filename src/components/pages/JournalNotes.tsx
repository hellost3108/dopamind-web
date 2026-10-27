import { PageIntro } from "@/components/pages/PageIntro";
import { FormattedText } from "@/components/content/FormattedText";
import { itemStr, list, str } from "@/lib/cms/fields";
import type { SectionContent } from "@/lib/cms/types";
export function JournalNotes({content}:{content:SectionContent}) {
  const line2 = str(content, "line2");
  const notes = list(content, "notes");

  return (
    <>
      <PageIntro
        eyebrow={str(content, "eyebrow")}
        title={
          <>
            <FormattedText value={str(content, "line1")} />
            {line2 && (
              <>
                <br />
                <span className="text-purple"><FormattedText value={line2} /></span>
              </>
            )}
          </>
        }
        body={str(content, "body")}
      />
      <section className="px-[clamp(20px,4vw,64px)] py-[clamp(56px,8vw,120px)]">
        <div className="mx-auto max-w-[1600px] border-t border-charcoal/10">
          {notes.map((note, index) => (
            <article
              key={index}
              className="grid gap-5 border-b border-charcoal/10 py-10 md:grid-cols-[80px_1fr_1fr] md:py-14"
            >
              <span className="text-xs text-charcoal/35">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <p className="text-[10px] uppercase tracking-[.17em] text-purple"><FormattedText value={itemStr(note, "tag")} /></p>
                <h2 className="mt-3 max-w-xl text-[clamp(1.8rem,4vw,4rem)] font-medium leading-[.98] tracking-[-.045em]">
                  <FormattedText value={itemStr(note, "title")} mode="block" phrasing />
                </h2>
              </div>
              <p className="max-w-lg self-end leading-relaxed text-charcoal/60 md:justify-self-end">
                <FormattedText value={itemStr(note, "body")} mode="block" phrasing />
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
