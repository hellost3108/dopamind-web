

import type { Metadata } from "next";
import { JournalNotes } from "@/components/pages/JournalNotes";
import { getSection } from "@/lib/cms/server";


export const metadata: Metadata = { title: "Nhật ký | DOPAMIND" };

/** Nội dung chỉnh được ở /admin/noi-dung/journal.notes */
export default async function JournalPage() {
  const content = await getSection("journal.notes");
  return <JournalNotes content={content} />;
}
