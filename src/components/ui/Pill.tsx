import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";

export function Pill({
  active,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      className={clsx(
        "cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-amber-400 bg-amber-50 text-amber-800"
          : "border-gray-300 bg-white text-gray-600 hover:border-amber-300",
        className
      )}
      {...props}
    />
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold tracking-wide text-amber-700 uppercase">
      {children}
    </span>
  );
}