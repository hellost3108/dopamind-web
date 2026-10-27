import type { ReactNode } from "react";
import { isFormattedText } from "@/lib/rich-text/content";
import { FormattedText } from "@/components/content/FormattedText";

function inline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|_[^_]+_|\[[^\]]+\]\(https?:\/\/[^\s)]+\))/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("_") && part.endsWith("_")) return <em key={index}>{part.slice(1, -1)}</em>;
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
    if (link) return <a key={index} href={link[2]} target="_blank" rel="noreferrer" className="text-purple underline underline-offset-4">{link[1]}</a>;
    return part;
  });
}

export function ArticleBody({ markdown }: { markdown: string }) {
  if (isFormattedText(markdown)) return <div className="[&_h2]:mb-4 [&_h2]:mt-12 [&_h2]:font-serif [&_h2]:text-3xl [&_h3]:mb-3 [&_h3]:mt-9 [&_h3]:font-serif [&_h3]:text-2xl [&_blockquote]:my-8 [&_blockquote]:border-l-2 [&_blockquote]:border-purple [&_blockquote]:pl-6 [&_blockquote]:font-serif [&_blockquote]:text-xl [&_blockquote]:italic"><FormattedText value={markdown} mode="block" /></div>;
  const lines = markdown.replaceAll("\r\n", "\n").split("\n");
  const nodes: ReactNode[] = [];
  let bullets: string[] = [];
  const flushBullets = () => {
    if (!bullets.length) return;
    nodes.push(<ul key={`list-${nodes.length}`} className="my-6 list-disc space-y-2 pl-6">{bullets.map((item, index) => <li key={index}>{inline(item)}</li>)}</ul>);
    bullets = [];
  };

  lines.forEach((raw, index) => {
    const line = raw.trim();
    if (line.startsWith("- ")) { bullets.push(line.slice(2)); return; }
    flushBullets();
    if (!line) return;
    if (line.startsWith("### ")) nodes.push(<h3 key={index} className="mb-3 mt-9 font-serif text-2xl">{inline(line.slice(4))}</h3>);
    else if (line.startsWith("## ")) nodes.push(<h2 key={index} className="mb-4 mt-12 font-serif text-3xl">{inline(line.slice(3))}</h2>);
    else if (line.startsWith("> ")) nodes.push(<blockquote key={index} className="my-8 border-l-2 border-purple pl-6 font-serif text-xl italic text-charcoal/75">{inline(line.slice(2))}</blockquote>);
    else nodes.push(<p key={index} className="my-5 leading-8 text-charcoal/75">{inline(line)}</p>);
  });
  flushBullets();
  return <div>{nodes}</div>;
}

