import type { ComponentType, ReactNode } from "react";
import type { ResolvedInputFieldOptions } from "./field-options";
import type { FieldState } from "@/utils/resolve-field-state";

export type FieldComponentApi<TValue = unknown> = {
  name: string;
  state: {
    value: TValue;
    meta: {
      errors: unknown[];
      isTouched?: boolean;
      isBlurred?: boolean;
      isDirty?: boolean;
      isValid?: boolean;
    };
    [key: string]: unknown;
  };
  handleChange: (value: TValue) => void;
  handleBlur?: () => void;
  [key: string]: unknown;
};

export type FieldComponentProps<
  TValue = unknown,
  TValues = Record<string, unknown>,
> = {
  field: FieldComponentApi<TValue>;
  config?: ResolvedInputFieldOptions<TValues, TValue>;
  state?: FieldState;
};

export type ContainerComponentProps<
  TValue = unknown,
  TValues = Record<string, unknown>,
> = {
  field: FieldComponentApi<TValue>;
  config?: unknown;
  state?: FieldState;
  children?: ReactNode;
  values?: TValues;
};

export type ComponentRegistry<TValues = Record<string, unknown>> = {
  string?: ComponentType<FieldComponentProps<string, TValues>>;
  email?: ComponentType<FieldComponentProps<string, TValues>>;
  url?: ComponentType<FieldComponentProps<string, TValues>>;
  select?: ComponentType<FieldComponentProps<string, TValues>>;
  date?: ComponentType<FieldComponentProps<string, TValues>>;
  time?: ComponentType<FieldComponentProps<string, TValues>>;
  datetime?: ComponentType<FieldComponentProps<string, TValues>>;
  "date-object"?: ComponentType<FieldComponentProps<Date | undefined, TValues>>;
  file?: ComponentType<FieldComponentProps<File | undefined, TValues>>;
  unknown?: ComponentType<FieldComponentProps<unknown, TValues>>;
  object?: ComponentType<ContainerComponentProps<Record<string, unknown>, TValues>>;
  array?: ComponentType<ContainerComponentProps<unknown[], TValues>>;
  union?: ComponentType<ContainerComponentProps<unknown, TValues>>;
  number?: ComponentType<FieldComponentProps<number | undefined, TValues>>;
  boolean?: ComponentType<FieldComponentProps<boolean, TValues>>;
};
