
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-2xl text-sm font-bold ring-offset-background transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 hover:scale-105 active:scale-95 shadow-2xl backdrop-blur-sm overflow-hidden group",
  "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-100%] before:transition-transform before:duration-700 hover:before:translate-x-[100%]",
  "after:absolute after:inset-0 after:bg-gradient-to-45deg after:from-transparent after:via-white/10 after:to-transparent after:opacity-0 after:transition-opacity after:duration-300 hover:after:opacity-100",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white hover:from-blue-700 hover:via-purple-700 hover:to-cyan-700 shadow-blue-500/30 hover:shadow-xl hover:shadow-purple-500/50 dark:from-blue-500 dark:via-purple-500 dark:to-cyan-500 dark:shadow-blue-400/30 border-2 border-blue-400/30 hover:border-purple-400/50",
        primary: "bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 text-white hover:from-indigo-700 hover:via-blue-700 hover:to-purple-700 shadow-indigo-500/30 hover:shadow-xl hover:shadow-blue-500/50 border-2 border-indigo-400/30 hover:border-blue-400/50",
        secondary: "bg-gradient-to-r from-slate-600 via-gray-600 to-slate-700 text-white hover:from-slate-700 hover:via-gray-700 hover:to-slate-800 shadow-slate-500/30 dark:from-slate-500 dark:via-gray-500 dark:to-slate-600 border-2 border-slate-400/30 hover:border-gray-400/50",
        success: "bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white hover:from-emerald-700 hover:via-green-700 hover:to-teal-700 shadow-emerald-500/30 hover:shadow-xl hover:shadow-green-500/50 border-2 border-emerald-400/30 hover:border-green-400/50",
        warning: "bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 text-white hover:from-amber-700 hover:via-yellow-700 hover:to-orange-700 shadow-amber-500/30 hover:shadow-xl hover:shadow-yellow-500/50 border-2 border-amber-400/30 hover:border-yellow-400/50",
        destructive: "bg-gradient-to-r from-red-600 via-pink-600 to-rose-600 text-white hover:from-red-700 hover:via-pink-700 hover:to-rose-700 shadow-red-500/30 hover:shadow-xl hover:shadow-pink-500/50 border-2 border-red-400/30 hover:border-pink-400/50",
        info: "bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-600 text-white hover:from-sky-700 hover:via-cyan-700 hover:to-blue-700 shadow-sky-500/30 hover:shadow-xl hover:shadow-cyan-500/50 border-2 border-sky-400/30 hover:border-cyan-400/50",
        outline: "border-3 border-blue-500/60 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 backdrop-blur-xl hover:bg-gradient-to-r hover:from-blue-500/20 hover:via-purple-500/20 hover:to-cyan-500/20 hover:border-blue-500/80 text-black dark:text-white dark:border-blue-400/60 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-cyan-900/20 dark:hover:from-blue-800/30 dark:hover:via-purple-800/30 dark:hover:to-cyan-800/30 shadow-lg hover:shadow-xl hover:shadow-blue-500/25",
        ghost: "hover:bg-gradient-to-r hover:from-blue-500/15 hover:via-purple-500/15 hover:to-cyan-500/15 text-black dark:text-white dark:hover:from-blue-900/25 dark:hover:via-purple-900/25 dark:hover:to-cyan-900/25 hover:shadow-lg hover:shadow-blue-500/20",
        link: "text-blue-600 underline-offset-4 hover:underline dark:text-blue-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 hover:drop-shadow-lg",
        premium: "bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 shadow-purple-500/30 hover:shadow-xl hover:shadow-pink-500/50 border-2 border-purple-400/30 hover:border-pink-400/50",
        neon: "bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 text-white hover:from-cyan-500 hover:via-blue-600 hover:to-purple-700 shadow-cyan-500/50 hover:shadow-xl hover:shadow-blue-500/60 border-2 border-cyan-300/50 hover:border-blue-400/60",
      },
      size: {
        default: "h-14 px-8 py-4 text-base",
        sm: "h-12 rounded-xl px-6 text-sm",
        lg: "h-16 rounded-2xl px-10 text-lg",
        xl: "h-20 rounded-3xl px-12 text-xl",
        icon: "h-14 w-14",
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
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
