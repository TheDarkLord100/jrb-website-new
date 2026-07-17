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
        "border-t-2 border-amber-400 bg-white p-6 shadow-sm ring-1 ring-gray-100",
        className
      )}
    >
      {children}
    </div>
  );
}