import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-emerald-500/15 text-emerald-700 border-emerald-400/30",
        emerald:
          "border-transparent bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
        amber:
          "border-transparent bg-amber-500/15 text-amber-300 border-amber-400/30",
        secondary:
          "border-slate-200 bg-slate-100 text-slate-600",
        destructive:
          "border-transparent bg-rose-500/15 text-rose-300 border-rose-400/30",
        outline: "text-foreground border-slate-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
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
