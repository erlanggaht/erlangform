import type { ComponentRegistry } from "@/types/component-registry";
import type { FieldMeta } from "@/infer";
import type { FieldConfig, FieldOptions, InputFieldOptions } from "@/types/field-options";
import { getValueByPath, joinPath } from "@/utils/field-path";
import { resolveFieldState } from "@/utils/resolve-field-state";
import { useEffect, type ReactNode } from "react";
import { FieldArray } from "./field-array";
import { ObjectField } from "./field-object/FieldObject";
import { Field } from "./field/Field";

type FieldRendererProps<TValues = Record<string, unknown>> = {
  form: any;
  field: FieldMeta;
  values: TValues;
  fieldConfig?: unknown;
  legacyFieldConfig?: FieldConfig<TValues>;

  parentPath?: string;
  fieldComponent?: ComponentRegistry<TValues>;
};

type FieldConfigScope = Record<string, FieldOptions<unknown, unknown> | undefined>;

type ArrayConfig = {
  itemLabel?: ReactNode | ((item: unknown, index: number) => ReactNode);
  addLabel?: string;
  removeLabel?: string;
};

function getFieldConfig(fieldConfig: unknown, legacyFieldConfig: unknown, name: string) {
  const scopedConfig = fieldConfig as FieldConfigScope | undefined;
  const legacyConfig = legacyFieldConfig as FieldConfigScope | undefined;

  return scopedConfig?.[name] ?? legacyConfig?.[name];
}

function getEmptyValue(type: string) {
  switch (type) {
    case "boolean":
      return false;

    case "number":
      return undefined;

    case "array":
      return [];

    case "object":
      return {};

    default:
      return "";
  }
}

function getDefaultValue(field: FieldMeta | undefined): unknown {
  if (!field) {
    return undefined;
  }

  switch (field.type) {
    case "string":
      return "";

    case "number":
      return undefined;

    case "boolean":
      return false;

    case "array":
      return [];

    case "object":
      return Object.fromEntries(
        (field.fields ?? []).map((child) => [child.name, getDefaultValue(child)]),
      );

    default:
      return "";
  }
}

export function FieldRenderer<TValues = Record<string, unknown>>({
  form,
  field,
  values,
  fieldConfig,
  legacyFieldConfig,
  parentPath,
  fieldComponent,
}: FieldRendererProps<TValues>) {
  const path = parentPath ? joinPath(parentPath, field.name) : field.name;
  const fallbackConfig = legacyFieldConfig ?? (fieldConfig as FieldConfig<TValues> | undefined);
  const config = getFieldConfig(fieldConfig, fallbackConfig, field.name) as
    | (FieldOptions<unknown, unknown> & { array?: ArrayConfig })
    | undefined;

  const effectiveConfig =
    field.options && !config?.options
      ? {
          ...config,
          options: field.options.map((value) => ({ label: value, value })),
        }
      : config;

  const conditionValues = parentPath ? getValueByPath(form.state.values, parentPath) : values;

  const state = resolveFieldState(effectiveConfig, conditionValues);
  const layout = effectiveConfig?.layout;

  useEffect(() => {
    if (!state.visible && effectiveConfig?.clearOnHide) {
      form.setFieldValue(path, getEmptyValue(field.type));
    }
  }, [state.visible, effectiveConfig?.clearOnHide, form, path, field.type]);

  if (!state.visible) {
    return null;
  }

  const content = (() => {
    if (field.type === "array") {
      const arrayConfig = config?.array;

      if (!field.item) {
        return null;
      }

      const itemField = field.item;

      return (
        <FieldArray<unknown>
          form={form}
          name={path}
          addLabel={arrayConfig?.addLabel}
          removeLabel={arrayConfig?.removeLabel}
          itemLabel={
            arrayConfig?.itemLabel as string | ((item: unknown, index: number) => string) | undefined
          }
          createItem={() => getDefaultValue(itemField)}
        >
          {(_item, index) => {
            return (
              <div className="erlform-array-item-content">
                <ObjectField<TValues>
                  form={form}
                  field={itemField}
                  parentPath={joinPath(path, index)}
                  fieldConfig={config}
                  legacyFieldConfig={fallbackConfig}
                  fieldComponent={fieldComponent}
                />
              </div>
            );
          }}
        </FieldArray>
      );
    }

    if (field.type === "object") {
      return (
        <ObjectField<TValues>
          form={form}
          field={field}
          parentPath={path}
          fieldConfig={config}
          legacyFieldConfig={fallbackConfig}
          fieldComponent={fieldComponent}
        />
      );
    }

    return (
      <Field<TValues>
        form={form}
        name={path}
        type={field.type}
        config={effectiveConfig as InputFieldOptions<TValues, unknown> | undefined}
        fieldComponent={fieldComponent}
        state={state}
      />
    );
  })();

  return (
    <div
      className="erlform-field"
      style={
        {
          "--erlform-col-span": layout?.colSpan ?? 12,
          "--erlform-sm": layout?.sm ?? layout?.colSpan ?? 12,
          "--erlform-md": layout?.md ?? layout?.sm ?? layout?.colSpan ?? 12,
          "--erlform-lg": layout?.lg ?? layout?.md ?? layout?.sm ?? layout?.colSpan ?? 12,
          "--erlform-xl":
            layout?.xl ?? layout?.lg ?? layout?.md ?? layout?.sm ?? layout?.colSpan ?? 12,
        } as React.CSSProperties
      }
    >
      {content}
    </div>
  );
}
