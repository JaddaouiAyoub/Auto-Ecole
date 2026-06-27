import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        // Base
        "h-9 w-full min-w-0 rounded-xl border border-input bg-background px-3 py-2 text-sm transition-all duration-200",
        // Placeholder & focus
        "placeholder:text-muted-foreground/60",
        "outline-none",
        "focus-visible:border-primary/50 focus-visible:ring-3 focus-visible:ring-primary/15 focus-visible:bg-background",
        // File input
        "file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        // Disabled
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        // Error state
        "aria-invalid:border-destructive/60 aria-invalid:ring-3 aria-invalid:ring-destructive/15",
        // Dark mode
        "dark:bg-secondary/30 dark:border-border/70",
        "dark:focus-visible:bg-secondary/50 dark:focus-visible:border-primary/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
