import type { ReactNode } from "react";

/** Đầu trang chuẩn (giống PageHeader của melalogy): nhãn đỏ, tiêu đề lớn, mô tả, nút thao tác. */
export function PageHeader({
  eyebrow = "Quản trị",
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f52334]">{eyebrow}</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">{title}</h1>
        {description && <p className="mt-2 max-w-3xl text-sm leading-6 text-black/55">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

/** Hộp thông báo (giống Notice của melalogy). */
export function Notice({ tone = "info", children }: { tone?: "info" | "warning" | "error"; children: ReactNode }) {
  const styles = {
    info: "border-sky-200 bg-sky-50 text-sky-900",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
    error: "border-red-200 bg-red-50 text-red-800",
  }[tone];
  return <div role={tone === "error" ? "alert" : undefined} className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${styles}`}>{children}</div>;
}
