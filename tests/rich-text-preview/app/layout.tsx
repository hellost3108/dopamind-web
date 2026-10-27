import type { ReactNode } from "react";
import "./preview.css";

export default function PreviewLayout({ children }: { children: ReactNode }) {
  return <html lang="vi"><body className="bg-[#f5f2ee] text-[#191716]">{children}</body></html>;
}
