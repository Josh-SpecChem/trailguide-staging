import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "p-[3px] relative bg-transparent border-none shadow-none group", // 'group' for hover effect
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        glow: "p-[3px] relative bg-transparent border-none shadow-none group",
        "btn-primary": "bg-offWhite text-blackOlive border-2 border-blackOlive hover:bg-mossGreen hover:border-mossGreen hover:text-black active:bg-primary active:border-primary active:text-black",
        "btn-outline": "border-2 border-primary text-primary hover:bg-primary/10 focus:ring-primary/50",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    // Glow/outline variant: gradient border, transparent inside, black on hover
    if (variant === "glow" || variant === "outline") {
      return (
        <Comp
          className={cn(
            buttonVariants({ variant, size }),
            "overflow-hidden rounded-lg relative group",
            className
          )}
          ref={ref}
          {...props}
        >
          {/* Glow border */}
          <span className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
          {/* Button content */}
          <span className="relative z-10 flex items-center justify-center w-full h-full rounded-lg px-8 py-2 bg-transparent text-black font-semibold transition-all duration-200 group-hover:bg-white/90">
            {children}
          </span>
        </Comp>
      );
    }

    // All other variants
    return (
      <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props}>
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };