import type { FieldState } from "@/utils/resolve-field-state";
import type { ReactNode } from "react";

type FieldLabelProps = {
  config?: { label?: ReactNode; labelClassName?: string };
  state: FieldState;
};

export function FieldLabel({ config, state }: FieldLabelProps) {
  const requiredMark = state.required && <span style={{ color: "red" }}> *</span>;

  if (typeof config?.label !== "string") {
    return <div className={config?.labelClassName}>{config?.label ?? ""}{requiredMark}</div>;
  }

  return (
    <label className={config?.labelClassName}>
      {config.label}
      {requiredMark}
    </label>
  );
}
