import * as React from "react";
import { clsx } from "clsx";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:pointer-events-none h-10 px-4 py-2",
          variant === "default" && "bg-black text-white hover:bg-zinc-800",
          variant === "outline" && "border border-zinc-300 hover:bg-zinc-50",
          variant === "ghost" && "hover:bg-zinc-100",
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
