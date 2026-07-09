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
          ? "border-[#001A23] bg-[#001A23] text-white"
          : "border-gray-300 bg-white text-gray-700 hover:border-[#001A23]",
        className
      )}
      {...props}
    />
  );
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold tracking-wide text-yellow-700 uppercase">
      {children}
    </span>
  );
}
