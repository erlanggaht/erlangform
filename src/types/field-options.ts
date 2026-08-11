import type { ComponentType } from "react";
import type { FieldLayout } from "./layout";
import type { Resolver } from "./resolver";
import type { SelectOption } from "./select-options";

export type FieldOptions = {
  type?: "text" | "password" | "textarea" | "number" | "checkbox";
  clearOnHide?: boolean;
  label?: Resolver<string>;
  placeholder?: Resolver<string>;
  description?: Resolver<string>;
  options?: Resolver<SelectOption[]>;

  layout?: FieldLayout;
  section?: string;

  className?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;

  component?: ComponentType<any>;

  array?: {
    itemLabel?: string | ((item: any, index: number) => string);
    addLabel?: string;
    removeLabel?: string;
  };
  showIf?: (values: any) => boolean;
  disableIf?: (values: any) => boolean;
  readOnlyIf?: (values: any) => boolean;
  requiredIf?: (values: any) => boolean;
};

export type ResolvedFieldOptions = Omit<
  FieldOptions,
  "label" | "placeholder" | "description" | "options"
> & {
  label?: string;
  placeholder?: string;
  description?: string;
  options?: SelectOption[];
};

export type FieldConfig = Record<string, FieldOptions>;
