import { clsx } from "clsx";
import type { ReactNode } from "react";

export default function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
}
