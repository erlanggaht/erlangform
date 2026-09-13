import type { FieldState } from "@/utils/resolve-field-state";
import type { ReactNode } from "react";

type FieldLabelProps = {
  config?: { label?: ReactNode; labelClassName?: string };
  state: FieldState;
  htmlFor?: string;
};

export function FieldLabel({ config, state, htmlFor }: FieldLabelProps) {
  const requiredMark = state.required && <span style={{ color: "red" }}> *</span>;

  if (typeof config?.label !== "string") {
    return (
      <label htmlFor={htmlFor} className={config?.labelClassName}>
        {config?.label ?? ""}
        {requiredMark}
      </label>
    );
  }

  return (
    <label htmlFor={htmlFor} className={config?.labelClassName}>
      {config.label}
      {requiredMark}
    </label>
  );
}
