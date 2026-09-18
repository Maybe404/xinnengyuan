import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-[13px] font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_1px_2px_oklch(0.4_0.03_260/0.25),inset_0_1px_0_oklch(1_0_0/0.22)] hover:bg-primary/90 active:scale-[0.98]",
        glass:
          "glass !bg-white/60 hover:!bg-white/80 text-foreground active:scale-[0.98] dark:!bg-white/[0.08] dark:hover:!bg-white/[0.14]",
        outline:
          "hairline bg-white/40 backdrop-blur-md hover:bg-white/70 text-foreground active:scale-[0.98] dark:bg-white/[0.06] dark:hover:bg-white/[0.12]",
        ghost: "hover:bg-foreground/[0.06] text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-8.5 px-4 py-2",
        sm: "h-7.5 px-3 text-xs",
        lg: "h-10 px-6 text-sm",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
