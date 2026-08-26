import type { FieldOptions } from "@/types/field-options";

export type FieldState = {
  visible: boolean;
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
};

export function resolveFieldState<TValues>(
  config: FieldOptions<TValues> | undefined,
  values: TValues,
): FieldState {
  return {
    visible: config?.showIf ? config.showIf(values) : true,
    disabled: config?.disableIf ? config.disableIf(values) : false,
    readOnly: config?.readOnlyIf ? config.readOnlyIf(values) : false,
    required: config?.requiredIf ? config.requiredIf(values) : false,
  };
}
