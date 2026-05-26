import { cn } from "@/lib/utils";

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

const styles: Record<StockStatus, { bg: string; color: string; label: string }> = {
  in_stock: { bg: "rgba(248, 188, 66,0.15)", color: "#F8BC42", label: "In Stock" },
  low_stock: { bg: "rgba(248,188,66,0.15)", color: "#F8BC42", label: "Low Stock" },
  out_of_stock: { bg: "rgba(26,31,54,0.08)", color: "#1A1F36", label: "Out of Stock" },
};

export function getStockStatus(quantity: number, reorderPoint: number): StockStatus {
  if (quantity <= 0) return "out_of_stock";
  if (quantity <= reorderPoint) return "low_stock";
  return "in_stock";
}

export function StockStatusBadge({
  status,
  className,
}: {
  status: StockStatus;
  className?: string;
}) {
  const s = styles[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        className,
      )}
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
}
