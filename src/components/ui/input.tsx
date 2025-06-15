
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border-2 border-transparent bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 backdrop-blur-sm px-4 py-3 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground/70 placeholder:italic focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 focus-visible:border-blue-500/50 focus-visible:bg-gradient-to-r focus-visible:from-blue-500/20 focus-visible:via-purple-500/20 focus-visible:to-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] dark:border-blue-500/30 dark:bg-gradient-to-r dark:from-slate-800/50 dark:via-slate-700/50 dark:to-slate-800/50 dark:focus-visible:from-blue-900/30 dark:focus-visible:via-purple-900/30 dark:focus-visible:to-cyan-900/30",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
