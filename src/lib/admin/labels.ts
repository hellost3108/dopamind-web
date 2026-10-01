// Nhãn + màu trạng thái dùng chung cho trang admin.

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipping",
  "completed",
  "cancelled",
  "refunded",
] as const;

export const PAYMENT_STATUSES = [
  "unpaid",
  "pending",
  "paid",
  "failed",
  "refunded",
  "partially_refunded",
] as const;

export const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: "Chờ xử lý",
  confirmed: "Đã xác nhận",
  processing: "Đang chuẩn bị",
  shipping: "Đang giao",
  completed: "Hoàn tất",
  cancelled: "Đã hủy",
  refunded: "Đã hoàn tiền",
};

export const ORDER_STATUS_STYLE: Record<string, string> = {
  pending: "bg-butter/60 text-charcoal",
  confirmed: "bg-lavender/60 text-charcoal",
  processing: "bg-lavender text-charcoal",
  shipping: "bg-purple/15 text-purple",
  completed: "bg-mint text-charcoal",
  cancelled: "bg-peach/50 text-charcoal",
  refunded: "bg-charcoal/10 text-charcoal/70",
};

export const PAYMENT_STATUS_LABEL: Record<string, string> = {
  unpaid: "Chưa thanh toán",
  pending: "Chờ thanh toán",
  paid: "Đã thanh toán",
  failed: "Thanh toán lỗi",
  refunded: "Đã hoàn tiền",
  partially_refunded: "Hoàn tiền một phần",
};

export const PAYMENT_STATUS_STYLE: Record<string, string> = {
  unpaid: "bg-butter/60 text-charcoal",
  pending: "bg-butter/60 text-charcoal",
  paid: "bg-mint text-charcoal",
  failed: "bg-peach/50 text-charcoal",
  refunded: "bg-charcoal/10 text-charcoal/70",
  partially_refunded: "bg-charcoal/10 text-charcoal/70",
};

export const PAYMENT_METHOD_LABEL: Record<string, string> = {
  cod: "Thanh toán khi nhận hàng (COD)",
  bank_transfer: "Chuyển khoản",
};

export const PRODUCT_STATUS_LABEL: Record<string, string> = {
  draft: "Nháp (đang ẩn)",
  active: "Đang bán",
  archived: "Lưu trữ (đang ẩn)",
};

export const PRODUCT_STATUS_STYLE: Record<string, string> = {
  draft: "bg-butter/60 text-charcoal",
  active: "bg-mint text-charcoal",
  archived: "bg-charcoal/10 text-charcoal/70",
};

export const LOW_STOCK_THRESHOLD = 5;
