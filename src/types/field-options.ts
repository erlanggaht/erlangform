import type { ComponentType } from "react";
import type { FieldComponentProps } from "./component-registry";
import type { FieldLayout } from "./layout";
import type { Resolver } from "./resolver";
import type { SelectOption } from "./select-options";

type NonNullish<T> = Exclude<T, null | undefined>;

export type DeepFieldKeys<T> = NonNullish<T> extends readonly (infer TItem)[]
  ? DeepFieldKeys<TItem>
  : NonNullish<T> extends object
    ? {
        [TKey in keyof NonNullish<T> & string]-?:
          | TKey
          | DeepFieldKeys<NonNullish<T>[TKey]>;
      }[keyof NonNullish<T> & string]
    : never;

export type FieldContext<TValues, TKey extends PropertyKey> = NonNullish<TValues> extends readonly (
  infer TItem
)[]
  ? FieldContext<TItem, TKey>
  : NonNullish<TValues> extends object
    ?
        | (TKey extends keyof NonNullish<TValues> ? NonNullish<TValues> : never)
        | {
            [TChildKey in keyof NonNullish<TValues>]-?: FieldContext<
              NonNullish<TValues>[TChildKey],
              TKey
            >;
          }[keyof NonNullish<TValues>]
    : never;

export type FieldValue<TValues, TKey extends PropertyKey> = NonNullish<TValues> extends readonly (
  infer TItem
)[]
  ? FieldValue<TItem, TKey>
  : NonNullish<TValues> extends object
    ?
        | (TKey extends keyof NonNullish<TValues> ? NonNullish<TValues>[TKey] : never)
        | {
            [TChildKey in keyof NonNullish<TValues>]-?: FieldValue<
              NonNullish<TValues>[TChildKey],
              TKey
            >;
          }[keyof NonNullish<TValues>]
    : never;

export type ArrayItem<T> = NonNullish<T> extends readonly (infer TItem)[] ? TItem : never;

export type FieldOptions<TValues = Record<string, unknown>, TValue = unknown> = {
  type?: "text" | "password" | "textarea" | "number" | "checkbox";

  clearOnHide?: boolean;

  label?: Resolver<string, TValues>;
  placeholder?: Resolver<string, TValues>;
  description?: Resolver<string, TValues>;
  options?: Resolver<SelectOption[], TValues>;

  layout?: FieldLayout;
  section?: string;

  className?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;

  component?: ComponentType<FieldComponentProps<TValue, TValues>>;

  array?: {
    itemLabel?: string | ((item: ArrayItem<TValue>, index: number) => string);
    arrayLabel?: string;
    addLabel?: string;
    removeLabel?: string;
  };

  showIf?: (values: TValues) => boolean;
  disableIf?: (values: TValues) => boolean;
  readOnlyIf?: (values: TValues) => boolean;
  requiredIf?: (values: TValues) => boolean;
};

export type ResolvedFieldOptions<TValues = Record<string, unknown>, TValue = unknown> = Omit<
  FieldOptions<TValues, TValue>,
  "label" | "placeholder" | "description" | "options"
> & {
  label?: string;
  placeholder?: string;
  description?: string;
  options?: SelectOption[];
};

export type FieldConfig<TValues = Record<string, unknown>> = {
  [TKey in DeepFieldKeys<TValues>]?: FieldOptions<
    FieldContext<TValues, TKey>,
    FieldValue<TValues, TKey>
  >;
};
