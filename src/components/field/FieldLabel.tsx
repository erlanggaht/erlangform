import type { FieldState } from "@/utils/resolve-field-state";

type FieldLabelProps = {
  config?: { label?: string; labelClassName?: string };
  state: FieldState;
};

export function FieldLabel({ config, state }: FieldLabelProps) {
  return (
    <label className={config?.labelClassName}>
      {config?.label ?? ""}
      {state.required && <span style={{ color: "red" }}> *</span>}
    </label>
  );
}
