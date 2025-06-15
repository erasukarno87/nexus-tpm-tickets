
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:scale-105 active:scale-95 shadow-lg backdrop-blur-sm",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 dark:from-blue-500 dark:to-purple-500 dark:shadow-blue-400/25",
        destructive:
          "bg-gradient-to-r from-red-600 to-pink-600 text-white hover:from-red-700 hover:to-pink-700 shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40",
        outline:
          "border-2 border-blue-500/50 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 hover:border-blue-500/70 text-black dark:text-white dark:border-blue-400/50 dark:from-blue-900/20 dark:to-purple-900/20 dark:hover:from-blue-800/30 dark:hover:to-purple-800/30",
        secondary:
          "bg-gradient-to-r from-slate-600 to-slate-700 text-white hover:from-slate-700 hover:to-slate-800 shadow-slate-500/25 dark:from-slate-500 dark:to-slate-600",
        ghost: "hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 text-black dark:text-white dark:hover:from-blue-900/20 dark:hover:to-purple-900/20",
        link: "text-blue-600 underline-offset-4 hover:underline dark:text-blue-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 rounded-lg px-4",
        lg: "h-14 rounded-xl px-8 text-base",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        style={style}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
