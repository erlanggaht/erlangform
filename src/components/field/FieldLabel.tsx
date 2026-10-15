import type { FieldState } from "@/utils/resolve-field-state";
import type { ReactNode } from "react";

type FieldLabelProps = {
  config?: { label?: ReactNode; labelClassName?: string };
  state: FieldState;
  htmlFor?: string;
  name?: string;
};

export function FieldLabel({ config, state, htmlFor, name }: FieldLabelProps) {
  const requiredMark = state.required && <span style={{ color: "red" }}> *</span>;
  const fallbackLabel = name
    ?.replace(/\[(\d+)\]/g, " $1 ")
    .replace(/[._-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

  if (typeof config?.label !== "string") {
    return (
      <label htmlFor={htmlFor} className={config?.labelClassName}>
        {config?.label ?? fallbackLabel ?? ""}
        {requiredMark}
      </label>
    );
  }

  return (
    <label htmlFor={htmlFor} className={config?.labelClassName}>
      {config.label || fallbackLabel}
      {requiredMark}
    </label>
  );
}
