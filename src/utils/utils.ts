import type { FieldLayout } from "@/types/layout";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLayoutClass(layout?: FieldLayout) {
  if (!layout) return "";

  const classes = [
    layout.colSpan ? `col-span-${layout.colSpan}` : "col-span-12",
    layout.sm ? `sm:col-span-${layout.sm}` : "",
    layout.md ? `md:col-span-${layout.md}` : "",
    layout.lg ? `lg:col-span-${layout.lg}` : "",
    layout.xl ? `xl:col-span-${layout.xl}` : "",
  ];

  return classes.filter(Boolean).join(" ");
}
