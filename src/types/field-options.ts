import type { ComponentType, ReactNode } from "react";
import type { ContainerComponentProps, FieldComponentProps } from "./component-registry";
import type { FieldLayout } from "./layout";
import type { Resolver } from "./resolver";
import type { SelectOption } from "./select-options";

type NonNullish<T> = Exclude<T, null | undefined>;
type UnionKeys<T> = T extends unknown ? keyof T : never;
type UnionValue<T, TKey extends PropertyKey> = T extends unknown
  ? TKey extends keyof T
    ? T[TKey]
    : never
  : never;

export type DeepFieldKeys<T> =
  NonNullish<T> extends readonly (infer TItem)[]
    ? DeepFieldKeys<TItem>
    : NonNullish<T> extends Date | File
      ? never
      : NonNullish<T> extends object
        ? string extends keyof NonNullish<T>
          ? never
          : {
              [TKey in keyof NonNullish<T> & string]-?: TKey | DeepFieldKeys<NonNullish<T>[TKey]>;
            }[keyof NonNullish<T> & string]
        : never;

export type FieldContext<TValues, TKey extends PropertyKey> =
  NonNullish<TValues> extends readonly (infer TItem)[]
    ? FieldContext<TItem, TKey>
    : NonNullish<TValues> extends object
      ? | (TKey extends keyof NonNullish<TValues> ? NonNullish<TValues> : never)
        | {
            [TChildKey in keyof NonNullish<TValues>]-?: FieldContext<
              NonNullish<TValues>[TChildKey],
              TKey
            >;
          }[keyof NonNullish<TValues>]
      : never;

export type FieldValue<TValues, TKey extends PropertyKey> =
  NonNullish<TValues> extends readonly (infer TItem)[]
    ? FieldValue<TItem, TKey>
    : NonNullish<TValues> extends object
      ? | (TKey extends keyof NonNullish<TValues> ? NonNullish<TValues>[TKey] : never)
        | {
            [TChildKey in keyof NonNullish<TValues>]-?: FieldValue<
              NonNullish<TValues>[TChildKey],
              TKey
            >;
          }[keyof NonNullish<TValues>]
      : never;

export type ArrayItem<T> = NonNullish<T> extends readonly (infer TItem)[] ? TItem : never;

type FieldChildren<TValue> =
  NonNullish<TValue> extends readonly (infer TItem)[]
    ? TItem
    : NonNullish<TValue> extends object
      ? NonNullish<TValue>
      : never;

/**
 * Configuration for the direct children of an object or an array item.
 * Keys are scoped to their parent, so two nested `phone` fields can be
 * configured independently.
 */
export type NestedFieldConfig<TValues> =
  NonNullish<TValues> extends object
    ? {
        [TKey in UnionKeys<NonNullish<TValues>> & string]?: FieldOptions<
          NonNullish<TValues>,
          UnionValue<NonNullish<TValues>, TKey>
        >;
      }
    : unknown;

type VisibilityOptions<TValues> = {
  clearOnHide?: boolean;
  layout?: FieldLayout;
  section?: string;
  showIf?: (values: TValues) => boolean;
};

export type InputFieldOptions<TValues, TValue> = VisibilityOptions<TValues> & {
  type?:
    | "text"
    | "password"
    | "textarea"
    | "number"
    | "checkbox"
    | "radio"
    | "email"
    | "url"
    | "date"
    | "time"
    | "datetime-local"
    | "file"
    | "range"
    | "color";

  label?: Resolver<ReactNode, TValues>;
  placeholder?: Resolver<string, TValues>;
  description?: Resolver<string, TValues>;
  options?: Resolver<SelectOption[], TValues>;
  min?: number | string;
  max?: number | string;
  step?: number | "any";
  accept?: string;
  multiple?: boolean;

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
    /** Configuration for each item; use recursively for arrays of arrays. */
    item?: FieldOptions<NonNullish<TValue>, ArrayItem<TValue>>;
    inputType?: "checkbox-group";
    options?: Resolver<SelectOption[], TValues>;
    component?: ComponentType<ContainerComponentProps<NonNullish<TValue>, TValues>>;
    array?: {
      itemLabel?: ReactNode | ((item: ArrayItem<TValue>, index: number) => ReactNode);
      addLabel?: string;
      removeLabel?: string;
      duplicateLabel?: string;
      moveUpLabel?: string;
      moveDownLabel?: string;
      emptyLabel?: string;
      minItems?: number;
      maxItems?: number;
      reorderable?: boolean;
    };
  };
type TupleFieldOptions<TValues, TValue extends readonly unknown[]> = VisibilityOptions<TValues> & {
  [TIndex in keyof TValue & `${number}`]?: FieldOptions<TValue, TValue[TIndex]>;
};
type ObjectFieldOptions<TValues, TValue> = VisibilityOptions<TValues> &
  NestedFieldConfig<FieldChildren<TValue>> & {
    component?: ComponentType<ContainerComponentProps<NonNullish<TValue>, TValues>>;
  };

type RecordFieldOptions<TValues, TValue> = VisibilityOptions<TValues> & {
  component?: ComponentType<ContainerComponentProps<NonNullish<TValue>, TValues>>;
};

/**
 * Options available for a field, based on its inferred Zod value.
 *
 * Objects and arrays expose their child fields directly. Leaf fields expose
 * input-specific options such as `label`, `placeholder`, and `options`.
 */
export type FieldOptions<TValues = Record<string, unknown>, TValue = unknown> =
  NonNullish<TValue> extends Date | File
    ? InputFieldOptions<TValues, TValue>
    : NonNullish<TValue> extends readonly unknown[]
      ? number extends NonNullish<TValue>["length"]
        ? ArrayFieldOptions<TValues, TValue>
        : TupleFieldOptions<TValues, NonNullish<TValue>>
      : string extends keyof NonNullish<TValue>
        ? RecordFieldOptions<TValues, TValue>
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

type RootFieldConfig<TValues> =
  NonNullish<TValues> extends object
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
