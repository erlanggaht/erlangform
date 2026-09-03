import type { ComponentType, ReactNode } from "react";
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

type FieldChildren<TValue> = NonNullish<TValue> extends readonly (infer TItem)[]
  ? TItem
  : NonNullish<TValue> extends object
    ? NonNullish<TValue>
    : never;

/**
 * Configuration for the direct children of an object or an array item.
 * Keys are scoped to their parent, so two nested `phone` fields can be
 * configured independently.
 */
export type NestedFieldConfig<TValues> = NonNullish<TValues> extends object
  ? {
      [TKey in keyof NonNullish<TValues> & string]?: FieldOptions<
        NonNullish<TValues>,
        NonNullish<TValues>[TKey]
      >;
    }
  : never;

type VisibilityOptions<TValues> = {
  clearOnHide?: boolean;
  layout?: FieldLayout;
  section?: string;
  showIf?: (values: TValues) => boolean;
};

export type InputFieldOptions<TValues, TValue> = VisibilityOptions<TValues> & {
  type?: "text" | "password" | "textarea" | "number" | "checkbox";

  label?: Resolver<ReactNode, TValues>;
  placeholder?: Resolver<string, TValues>;
  description?: Resolver<string, TValues>;
  options?: Resolver<SelectOption[], TValues>;

  className?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;

  component?: ComponentType<FieldComponentProps<TValue, TValues>>;
  disableIf?: (values: TValues) => boolean;
  readOnlyIf?: (values: TValues) => boolean;
  requiredIf?: (values: TValues) => boolean;
};

type ArrayFieldOptions<TValues, TValue> = VisibilityOptions<TValues> &
  NestedFieldConfig<ArrayItem<TValue>> & {
    array?: {
      itemLabel?: ReactNode | ((item: ArrayItem<TValue>, index: number) => ReactNode);
    addLabel?: string;
    removeLabel?: string;
  };
};

type ObjectFieldOptions<TValues, TValue> = VisibilityOptions<TValues> &
  NestedFieldConfig<FieldChildren<TValue>>;

/**
 * Options available for a field, based on its inferred Zod value.
 *
 * Objects and arrays expose their child fields directly. Leaf fields expose
 * input-specific options such as `label`, `placeholder`, and `options`.
 */
export type FieldOptions<TValues = Record<string, unknown>, TValue = unknown> =
  NonNullish<TValue> extends readonly unknown[]
    ? ArrayFieldOptions<TValues, TValue>
    : NonNullish<TValue> extends object
      ? ObjectFieldOptions<TValues, TValue>
      : InputFieldOptions<TValues, TValue>;

export type ResolvedInputFieldOptions<TValues = Record<string, unknown>, TValue = unknown> = Omit<
  InputFieldOptions<TValues, TValue>,
  "label" | "placeholder" | "description" | "options"
> & {
  label?: ReactNode;
  placeholder?: string;
  description?: string;
  options?: SelectOption[];
};

export type ResolvedFieldOptions<TValues = Record<string, unknown>, TValue = unknown> = Omit<
  FieldOptions<TValues, TValue>,
  "label" | "placeholder" | "description" | "options"
> & {
  label?: ReactNode;
  placeholder?: string;
  description?: string;
  options?: SelectOption[];
};

type RootFieldConfig<TValues> = NonNullish<TValues> extends object
  ? {
      [TKey in keyof NonNullish<TValues> & string]?: FieldOptions<
        NonNullish<TValues>,
        NonNullish<TValues>[TKey]
      >;
    }
  : never;

type LegacyNestedFieldConfig<TValues> = {
  [TKey in Exclude<DeepFieldKeys<TValues>, keyof NonNullish<TValues> & string>]?: FieldOptions<
    FieldContext<TValues, TKey>,
    FieldValue<TValues, TKey>
  >;
};

/**
 * Root field configuration. Put object and array children directly on their parent.
 *
 * Flat nested keys are retained for backwards compatibility and are used as a
 * fallback when a scoped configuration is not present.
 */
export type FieldConfig<TValues = Record<string, unknown>> = RootFieldConfig<TValues> &
  LegacyNestedFieldConfig<TValues>;
