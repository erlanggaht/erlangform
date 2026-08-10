import type { FieldOptions } from "@/types/field-options";
import type { Resolver } from "@/types/resolver";

export function resolveValue<T>(value: Resolver<T> | undefined, values: any): T | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === "function") {
    return (value as (values: any) => T)(values);
  }

  return value;
}

export function resolveFieldConfig(config: FieldOptions | undefined, values: any) {
  if (!config) {
    return undefined;
  }

  return {
    ...config,
    label: resolveValue(config.label, values),
    placeholder: resolveValue(config.placeholder, values),
    description: resolveValue(config.description, values),
    options: resolveValue(config.options, values),
  };
}
