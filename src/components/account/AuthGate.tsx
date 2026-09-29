"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signInAction, signUpAction, type AuthFormState } from "@/lib/supabase/auth-actions";
import { lookupGuestOrder } from "@/app/tra-cuu-don-hang/actions";
import type { GuestOrder } from "@/lib/supabase/orders";

const STATUS_LABEL_VI: Record<string, string> = {
  pending: "Chờ xử lý",
  confirmed: "Đã xác nhận",
  processing: "Đang chuẩn bị",
  shipping: "Đang giao",
  completed: "Hoàn tất",
  cancelled: "Đã hủy",
  refunded: "Đã hoàn tiền",
};

const vnd = (n: number) => `${new Intl.NumberFormat("vi-VN").format(n)}đ`;

const label = "block text-[10px] font-medium uppercase tracking-[.16em] text-charcoal/55";
const input =
  "mt-2 min-h-12 w-full rounded-xl border border-charcoal/15 bg-white px-4 text-sm font-medium text-charcoal outline-none transition-colors focus:border-purple focus:ring-2 focus:ring-purple/20 placeholder:font-normal placeholder:text-charcoal/30";
const primaryButton =
  "flex min-h-12 w-full items-center justify-center rounded-full bg-charcoal px-5 text-xs font-medium uppercase tracking-[.13em] text-cloud-milk transition-opacity hover:opacity-90 disabled:opacity-50";
const outlineButton =
  "flex min-h-12 w-full items-center justify-center rounded-full border border-charcoal/20 bg-white/60 px-5 text-xs font-medium uppercase tracking-[.13em] text-charcoal/70 transition-colors hover:border-charcoal hover:text-charcoal";

function FormMessage({ state }: { state: AuthFormState }) {
  if (!state?.error && !state?.notice) return null;
  return (
    <p
      role="status"
      className={`rounded-xl border-l-2 px-3 py-2 text-sm leading-relaxed ${
        state.error
          ? "border-peach bg-peach/10 text-charcoal"
          : "border-purple bg-purple/5 text-charcoal/75"
      }`}
    >
      {state.error ?? state.notice}
    </p>
  );
}

function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(signInAction, undefined);

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="redirect" value={redirectTo} />
      <div>
        <label className={label} htmlFor="login-email">
          Email
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={input}
        />
      </div>
      <div>
        <label className={label} htmlFor="login-password">
          Mật khẩu
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={input}
        />
      </div>
      <FormMessage state={state} />
      <button type="submit" disabled={pending} className={primaryButton}>
        {pending ? "ĐANG XỬ LÝ..." : "ĐĂNG NHẬP"}
      </button>
      <Link href="/tai-khoan/quen-mat-khau" className={outlineButton}>
        QUÊN MẬT KHẨU?
      </Link>
    </form>
  );
}

function SignupForm({ redirectTo }: { redirectTo: string }) {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(signUpAction, undefined);

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="redirect" value={redirectTo} />
      <div>
        <label className={label} htmlFor="signup-name">
          Họ và tên
        </label>
        <input id="signup-name" name="name" type="text" autoComplete="name" required className={input} />
      </div>
      <div>
        <label className={label} htmlFor="signup-email">
          Email
        </label>
        <input
          id="signup-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={input}
        />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="signup-password">
            Mật khẩu
          </label>
          <input
            id="signup-password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={6}
            required
            className={input}
          />
        </div>
        <div>
          <label className={label} htmlFor="signup-confirm-password">
            Xác nhận mật khẩu
          </label>
          <input
            id="signup-confirm-password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={6}
            required
            className={input}
          />
        </div>
      </div>
      <FormMessage state={state} />
      <button type="submit" disabled={pending} className={primaryButton}>
        {pending ? "ĐANG XỬ LÝ..." : "TẠO TÀI KHOẢN"}
      </button>
    </form>
  );
}

export function OrderLookup() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<GuestOrder | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setOrder(null);

    if (!orderNumber.trim() || !phone.trim()) {
      setError("Vui lòng nhập đầy đủ mã đơn hàng và số điện thoại.");
      return;
    }

    setLoading(true);
    try {
      const result = await lookupGuestOrder(orderNumber, phone);
      if (!result.ok) setError(result.error);
      else setOrder(result.order);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-charcoal/10 bg-white/50 p-[clamp(24px,4vw,44px)] lg:col-span-2">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[.16em] text-charcoal/55">
            Không cần tài khoản
          </p>
          <h2 className="mt-2 text-[clamp(1.25rem,2.2vw,1.6rem)] font-medium uppercase leading-[1.25] tracking-[-.01em] text-charcoal">
            Tra cứu đơn hàng
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-charcoal/60 sm:text-right">
          Nhập mã đơn và số điện thoại bạn đã dùng khi đặt hàng để xem tình trạng đơn.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div>
          <label className={label} htmlFor="lookup-order">
            Mã đơn hàng
          </label>
          <input
            id="lookup-order"
            className={input}
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="DPM260925XXXXX"
          />
        </div>
        <div>
          <label className={label} htmlFor="lookup-phone">
            Số điện thoại đã đặt hàng
          </label>
          <input
            id="lookup-phone"
            className={input}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0901 234 567"
            type="tel"
          />
        </div>
        <button type="submit" disabled={loading} className={`${primaryButton} sm:mt-0 sm:w-40`}>
          {loading ? "ĐANG TRA CỨU..." : "TRA CỨU"}
        </button>
      </form>

      {error && (
        <p className="mt-4 rounded-xl border-l-2 border-peach bg-peach/10 px-3 py-2 text-sm leading-relaxed text-charcoal">
          {error}
        </p>
      )}

      {order && (
        <div className="mt-6 rounded-2xl border border-charcoal/10 bg-white p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-charcoal/10 pb-4">
            <div>
              <p className="text-sm font-medium text-charcoal">{order.order_number}</p>
              <p className="mt-1 text-xs text-charcoal/50">
                Đặt ngày {new Date(order.created_at).toLocaleDateString("vi-VN")}
              </p>
            </div>
            <span className="rounded-full bg-purple/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[.08em] text-purple">
              {STATUS_LABEL_VI[order.status] ?? order.status}
            </span>
          </div>

          {order.shipping_address_snapshot && (
            <div className="border-b border-charcoal/10 py-4 text-sm">
              <p className="font-medium text-charcoal">{order.recipient_name}</p>
              <p className="mt-0.5 text-charcoal/60">{order.phone}</p>
              <p className="mt-1 leading-relaxed text-charcoal/70">
                {order.shipping_address_snapshot.address_line_1}
                {order.shipping_address_snapshot.address_line_2
                  ? `, ${order.shipping_address_snapshot.address_line_2}`
                  : ""}
                , {order.shipping_address_snapshot.ward}, {order.shipping_address_snapshot.district},{" "}
                {order.shipping_address_snapshot.province}
              </p>
            </div>
          )}

          <ul className="space-y-3 border-b border-charcoal/10 py-4">
            {order.items.map((item, i) => (
              <li key={i} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-charcoal/70">
                  {item.product_name} × {item.quantity}
                </span>
                <span className="font-medium text-charcoal">{vnd(item.line_total)}</span>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between pt-4">
            <span className="text-sm font-medium text-charcoal/70">Tổng cộng</span>
            <span className="font-serif text-xl text-purple">{vnd(order.total_amount)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function AuthGate({ redirectTo }: { redirectTo: string }) {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const tabButton = (active: boolean) =>
    `min-h-11 flex-1 rounded-full text-xs font-medium uppercase tracking-[.13em] transition-colors ${
      active ? "bg-charcoal text-cloud-milk" : "text-charcoal/50 hover:text-charcoal"
    }`;

  return (
    <div className="mx-auto grid max-w-4xl items-stretch gap-5 lg:grid-cols-2 lg:gap-6">
      {/* Thẻ đăng nhập / đăng ký */}
      <div className="flex flex-col rounded-3xl bg-lavender/35 p-[clamp(24px,4vw,44px)]">
        <div className="flex gap-1 rounded-full bg-white/70 p-1">
          <button type="button" className={tabButton(tab === "login")} onClick={() => setTab("login")}>
            ĐĂNG NHẬP
          </button>
          <button type="button" className={tabButton(tab === "signup")} onClick={() => setTab("signup")}>
            ĐĂNG KÝ
          </button>
        </div>

        <div className="mt-7">
          {tab === "login" ? <LoginForm redirectTo={redirectTo} /> : <SignupForm redirectTo={redirectTo} />}
        </div>

        {tab === "login" ? (
          <p className="mt-6 text-center text-xs uppercase tracking-[.12em] text-charcoal/55">
            CHƯA CÓ TÀI KHOẢN?{" "}
            <button type="button" className="font-medium text-charcoal underline" onClick={() => setTab("signup")}>
              ĐĂNG KÝ
            </button>
          </p>
        ) : (
          <p className="mt-6 text-center text-xs uppercase tracking-[.12em] text-charcoal/55">
            ĐÃ CÓ TÀI KHOẢN?{" "}
            <button type="button" className="font-medium text-charcoal underline" onClick={() => setTab("login")}>
              ĐĂNG NHẬP
            </button>
          </p>
        )}
      </div>

      {/* Thẻ danh sách yêu thích */}
      <div className="flex flex-col items-center justify-center rounded-3xl border border-charcoal/10 bg-white/50 p-[clamp(24px,4vw,44px)] text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-purple/10 text-purple">
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z" />
          </svg>
        </span>
        <h2 className="mt-6 text-[clamp(1.5rem,2.6vw,2rem)] font-medium uppercase leading-[1.25] tracking-[-.02em] text-charcoal">
          Danh sách
          <br />
          yêu thích
        </h2>
        <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-charcoal/60">
          Các sản phẩm đã lưu vẫn được giữ trên thiết bị này, kể cả trước khi bạn đăng nhập.
        </p>
        <Link
          href="/yeu-thich"
          className="mt-7 flex min-h-11 w-fit items-center rounded-full border border-charcoal px-6 text-xs font-medium uppercase tracking-[.13em] text-charcoal transition-colors hover:bg-charcoal hover:text-cloud-milk"
        >
          Xem danh sách
        </Link>
      </div>

      {/* Thẻ tra cứu đơn hàng (không cần đăng nhập) */}
      <OrderLookup />
    </div>
  );
}
