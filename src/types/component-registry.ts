import type { AnyFieldApi } from "@tanstack/react-form";
import type { ComponentType } from "react";
import type { ResolvedFieldOptions } from "./field-options";

export type FieldComponentApi<TValue = unknown> = Omit<AnyFieldApi, "state" | "handleChange"> & {
  state: Omit<AnyFieldApi["state"], "value"> & { value: TValue };
  handleChange: (value: TValue) => void;
};

export type FieldComponentProps<
  TValue = unknown,
  TValues = Record<string, unknown>,
> = {
  field: FieldComponentApi<TValue>;
  config?: ResolvedFieldOptions<TValues, TValue>;
};

export type ComponentRegistry<TValues = Record<string, unknown>> = {
  string?: ComponentType<FieldComponentProps<string, TValues>>;
  number?: ComponentType<FieldComponentProps<number | undefined, TValues>>;
  boolean?: ComponentType<FieldComponentProps<boolean, TValues>>;
};
