import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "accent"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DF6C4F] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    
    const variants = {
      default: "bg-[#0A0A0A] text-[#FAFAFA] hover:bg-[#0A0A0A]/90 dark:bg-[#FAFAFA] dark:text-[#0A0A0A] dark:hover:bg-[#FAFAFA]/90",
      accent: "bg-[#DF6C4F] text-white hover:bg-[#DF6C4F]/90 focus-visible:ring-[#DF6C4F]",
      destructive: "bg-red-500 text-white hover:bg-red-500/90",
      outline: "border border-[rgba(0,0,0,0.12)] dark:border-[rgba(255,255,255,0.12)] bg-transparent hover:bg-black/5 dark:hover:bg-white/5",
      secondary: "bg-black/5 text-current hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15",
      ghost: "hover:bg-black/5 dark:hover:bg-white/5",
      link: "text-[#DF6C4F] underline-offset-4 hover:underline",
    }

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-12 rounded-md px-8 text-base",
      icon: "h-10 w-10",
    }

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
