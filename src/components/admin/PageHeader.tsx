import type { ReactNode } from "react";

/** Đầu trang chuẩn của admin: tiêu đề, mô tả ngắn và (tùy chọn) nút thao tác bên phải. */
export function PageHeader({
  title,
  description,
  actions,
  back,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  back?: ReactNode;
}) {
  return (
    <header className="mb-8 border-b border-charcoal/[.08] pb-6">
      {back && <div className="mb-3 text-sm">{back}</div>}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-serif text-[1.75rem] leading-tight text-charcoal sm:text-[2rem]">{title}</h1>
          {description && <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-charcoal/60">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
