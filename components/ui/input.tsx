import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm",
        "placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2",
        "focus-visible:ring-brand-blue focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        "aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus-visible:ring-red-500",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
