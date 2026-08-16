import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "accent"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-[#0A0A0A] text-[#FAFAFA] dark:bg-[#FAFAFA] dark:text-[#0A0A0A]",
    secondary: "bg-black/5 text-current dark:bg-white/10",
    outline: "border border-[rgba(0,0,0,0.15)] dark:border-[rgba(255,255,255,0.15)] text-current",
    accent: "border border-[#DF6C4F] text-[#DF6C4F] bg-[#DF6C4F]/5",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
