import type { FieldOptions } from "@/types/field-options";

export type FieldState = {
  visible: boolean;
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
};

export function resolveFieldState(config: FieldOptions | undefined, values: any): FieldState {
  return {
    visible: config?.showIf ? config.showIf(values) : true,
    disabled: config?.disableIf ? config.disableIf(values) : false,
    readOnly: config?.readOnlyIf ? config.readOnlyIf(values) : false,
    required: config?.requiredIf ? config.requiredIf(values) : false,
  };
}
