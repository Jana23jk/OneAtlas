import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-brand-primary/10 text-brand-primary",
        secondary: "bg-surface-border text-text-secondary",
        success: "bg-brand-teal/10 text-brand-teal",
        info: "bg-brand-cyan/10 text-brand-cyan",
        warning: "bg-brand-yellow/10 text-brand-yellow",
        cta: "bg-brand-pink/10 text-brand-pink",
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
