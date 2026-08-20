import { formatVnd } from "@/lib/format";
import { cn } from "@/lib/utils";

export function PriceDisplay({
  price,
  compareAtPrice,
  className,
}: {
  price: number;
  compareAtPrice?: number;
  className?: string;
}) {
  const hasValidDiscount =
    typeof compareAtPrice === "number" && compareAtPrice > price;

  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span className="font-medium text-charcoal">{formatVnd(price)}</span>
      {hasValidDiscount && (
        <span className="text-sm text-charcoal/40 line-through">
          {formatVnd(compareAtPrice)}
        </span>
      )}
    </div>
  );
}
