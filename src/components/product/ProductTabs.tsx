"use client";

import { useState } from "react";

const TABS = [
  { id: "mo-ta", label: "Mô tả" },
  { id: "thanh-phan", label: "Thành phần" },
  { id: "cong-dung", label: "Công dụng" },
  { id: "huong-dan", label: "Hướng dẫn sử dụng" },
  { id: "danh-gia", label: "Đánh giá" },
];

function CheckIcon() {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lavender/50 text-purple">
      <svg
        viewBox="0 0 24 24"
        width="12"
        height="12"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      </svg>
    </span>
  );
}

export function ProductTabs({
  description,
  benefits,
}: {
  description?: string;
  benefits: string[];
}) {
  const [active, setActive] = useState("mo-ta");
  const hasDescription = Boolean(description) || benefits.length > 0;

  return (
    <div>
      <div
        role="tablist"
        aria-label="Thông tin sản phẩm"
        className="flex overflow-x-auto border-b border-charcoal/10"
      >
        {TABS.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActive(tab.id)}
              className={`relative min-h-12 flex-1 whitespace-nowrap px-4 text-sm transition-colors ${
                isActive ? "font-semibold text-charcoal" : "text-charcoal/55"
              }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute inset-x-4 -bottom-px h-0.5 bg-charcoal" />
              )}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`panel-${active}`}
        aria-labelledby={`tab-${active}`}
        className="pt-8"
      >
        {active === "mo-ta" && hasDescription ? (
          <div>
            {description && (
              <p className="max-w-2xl text-base leading-relaxed text-charcoal/65">
                {description}
              </p>
            )}
            {benefits.length > 0 && (
              <ul className="mt-6 flex flex-col gap-3">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3 text-sm text-charcoal/75">
                    <CheckIcon />
                    {benefit}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <p className="text-sm text-charcoal/55">
            {active === "danh-gia"
              ? "Chưa có đánh giá nào."
              : "Nội dung đang được cập nhật."}
          </p>
        )}
      </div>
    </div>
  );
}