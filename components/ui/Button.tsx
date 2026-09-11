import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const variantStyles = {
      primary: "bg-[#0f2942] hover:bg-[#163a5d] text-white shadow-sm border border-transparent active:scale-[0.98]",
      secondary: "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 active:scale-[0.98]",
      outline: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm active:scale-[0.98]",
      ghost: "hover:bg-slate-100 text-slate-700 active:scale-[0.98]",
      danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-sm border border-transparent active:scale-[0.98]",
      success: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm border border-transparent active:scale-[0.98]",
    };

    const sizeStyles = {
      sm: "h-8 px-3 text-xs font-medium rounded-md gap-1.5",
      md: "h-9 px-4 text-sm font-medium rounded-lg gap-2",
      lg: "h-11 px-5 text-base font-medium rounded-lg gap-2.5",
      icon: "h-9 w-9 p-0 rounded-lg justify-center",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-150 disabled:pointer-events-none disabled:opacity-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0f2942] focus:ring-offset-2",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
