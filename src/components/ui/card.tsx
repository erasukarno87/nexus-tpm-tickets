
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative rounded-3xl border-2 bg-gradient-to-br from-white/10 via-blue-500/5 to-purple-500/10 dark:from-slate-900/60 dark:via-blue-950/40 dark:to-purple-950/60 backdrop-blur-xl border-gradient-to-r from-blue-500/30 via-purple-500/20 to-cyan-500/30 dark:border-blue-400/40 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] hover:rotate-[0.5deg] overflow-hidden",
      "before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-500/10 before:via-purple-500/5 before:to-cyan-500/10 before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100",
      "after:absolute after:inset-0 after:bg-gradient-to-45deg after:from-transparent after:via-white/5 after:to-transparent after:opacity-0 after:transition-opacity after:duration-300 hover:after:opacity-100",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-8 relative z-10", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-3xl font-black leading-none tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-cyan-400 drop-shadow-lg animate-gradientShift bg-size-200 relative",
      "before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-600/20 before:via-purple-600/20 before:to-cyan-600/20 before:blur-lg before:opacity-50 before:-z-10",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-base text-gray-600 dark:text-gray-300 opacity-90 font-medium leading-relaxed", className)} {...props} />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-8 pt-0 relative z-10", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-8 pt-0 relative z-10", className)} {...props} />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
