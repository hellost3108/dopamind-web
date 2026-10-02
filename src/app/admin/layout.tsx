import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = {
  title: "Quản trị | DOPAMIND",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="flex flex-1 flex-col bg-cloud-milk lg:flex-row">
      <AdminNav email={admin.email ?? ""} />
      <div className="min-w-0 flex-1 px-[clamp(16px,3vw,48px)] py-8 lg:py-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </div>
    </div>
  );
}
