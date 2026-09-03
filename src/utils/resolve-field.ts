import type { InputFieldOptions, ResolvedInputFieldOptions } from "@/types/field-options";
import type { Resolver } from "@/types/resolver";
import type { ReactNode } from "react";

export function resolveValue<T, TValues>(
  value: Resolver<T, TValues> | undefined,
  values: TValues,
): T | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value === "function") {
    return (value as (values: TValues) => T)(values);
  }

  return value;
}

export function resolveFieldConfig<TValues, TValue>(
  config: InputFieldOptions<TValues, TValue> | undefined,
  values: TValues,
): ResolvedInputFieldOptions<TValues, TValue> | undefined {
  if (!config) {
    return undefined;
  }

  return {
    ...config,
    label: resolveValue<ReactNode, TValues>(config.label, values),
    placeholder: resolveValue<string, TValues>(config.placeholder, values),
    description: resolveValue<string, TValues>(config.description, values),
    options: resolveValue(config.options, values),
  };
}
