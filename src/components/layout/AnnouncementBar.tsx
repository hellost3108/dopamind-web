import { getSiteContent } from "@/lib/site-content";

export async function AnnouncementBar() {
  const c = await getSiteContent();
  const text = c["announcement.text"];
  if (!text) return null;

  return (
    <div className="bg-charcoal px-[clamp(16px,4vw,64px)] py-2.5 text-center">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-cloud-milk">{text}</p>
    </div>
  );
}
