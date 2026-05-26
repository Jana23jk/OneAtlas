import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-brand-primary/10 text-brand-primary",
        secondary: "bg-brand-accent/20 text-[#1A1F36]",
        success: "bg-brand-primary/15 text-brand-primary",
        info: "bg-brand-primary/10 text-brand-primary",
        warning: "bg-brand-accent/25 text-[#1A1F36]",
        cta: "bg-brand-accent/25 text-[#1A1F36]",
        outline: "border border-surface-border text-text-secondary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
