import type { FieldMeta } from "@/infer";
import type { ComponentRegistry } from "@/types/component-registry";
import type { FieldConfig, FieldOptions, InputFieldOptions } from "@/types/field-options";
import { getValueByPath, joinPath } from "@/utils/field-path";
import { resolveValue } from "@/utils/resolve-field";
import { resolveFieldState } from "@/utils/resolve-field-state";
import { useEffect, type ComponentType, type CSSProperties, type ReactNode } from "react";
import { FieldArray } from "./field-array";
import { CheckboxGroup } from "./field-array/CheckboxGroup";
import { TupleField } from "./field-array/TupleField";
import { DiscriminatedUnionField } from "./field-object/DiscriminatedUnionField";
import { ObjectField } from "./field-object/FieldObject";
import { RecordField } from "./field-object/RecordField";
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
  inputType?: "checkbox-group";
  itemLabel?: ReactNode | ((item: unknown, index: number) => ReactNode);
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

    case "date-object":
    case "datetime":
      return undefined;

    case "file":
      return undefined;

    case "array":
      return [];

    case "tuple":
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
      return field.options?.[0] ?? "";

    case "number":
      return undefined;

    case "date-object":
    case "datetime":
      return undefined;

    case "file":
      return undefined;

    case "boolean":
      return false;

    case "array":
      return [];

    case "record":
      return {};

    case "union":
      return getDefaultValue(field.variants?.[0]);

    case "tuple":
      return (field.items ?? []).map((item) => getDefaultValue(item));

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
  const childName =
    parentPath &&
    Array.isArray(getValueByPath(form.state.values, parentPath)) &&
    /^\d+$/.test(field.name)
      ? Number(field.name)
      : field.name;
  const path = parentPath ? joinPath(parentPath, childName) : field.name;
  const fallbackConfig = legacyFieldConfig ?? (fieldConfig as FieldConfig<TValues> | undefined);
  const config = getFieldConfig(fieldConfig, fallbackConfig, field.name) as
    | (FieldOptions<unknown, unknown> & {
        inputType?: "checkbox-group";
        array?: ArrayConfig;
        item?: unknown;
      })
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
  const layoutStyle = {
    "--erlform-col-span": layout?.colSpan ?? 12,
    "--erlform-sm": layout?.sm ?? layout?.colSpan ?? 12,
    "--erlform-md": layout?.md ?? layout?.sm ?? layout?.colSpan ?? 12,
    "--erlform-lg": layout?.lg ?? layout?.md ?? layout?.sm ?? layout?.colSpan ?? 12,
    "--erlform-xl": layout?.xl ?? layout?.lg ?? layout?.md ?? layout?.sm ?? layout?.colSpan ?? 12,
  } as CSSProperties;

  useEffect(() => {
    if (!state.visible && effectiveConfig?.clearOnHide) {
      form.setFieldValue(path, getEmptyValue(field.type));
    }
  }, [state.visible, effectiveConfig?.clearOnHide, form, path, field.type]);

  if (!state.visible) {
    return null;
  }

  const fieldComponentOverride = (
    config as
      | {
          component?: ComponentType<{
            field: unknown;
            config?: unknown;
            state?: unknown;
            values?: unknown;
          }>;
        }
      | undefined
  )?.component;
  const containerComponent =
    fieldComponentOverride ??
    (fieldComponent?.[field.type as "array" | "object"] as typeof fieldComponentOverride);
  const ContainerComponent = containerComponent;

  if (ContainerComponent && (field.type === "array" || field.type === "object")) {
    return (
      <div className="erlform-field" style={layoutStyle}>
        <form.Field name={path}>
          {(fieldApi: unknown) => (
            <ContainerComponent field={fieldApi} config={config} state={state} values={values} />
          )}
        </form.Field>
      </div>
    );
  }

  if (field.type === "array" && config?.inputType === "checkbox-group" && config.options) {
    const options = resolveValue(config.options, conditionValues) ?? [];

    return (
      <div className="erlform-field" style={layoutStyle}>
        <CheckboxGroup<TValues> form={form} name={path} values={values} options={options} />
      </div>
    );
  }

  if (field.type === "union" && field.discriminator) {
    return (
      <div className="erlform-field" style={layoutStyle}>
        <DiscriminatedUnionField<TValues>
          form={form}
          field={field}
          parentPath={path}
          fieldConfig={config}
          legacyFieldConfig={fallbackConfig}
          fieldComponent={fieldComponent}
        />
      </div>
    );
  }

  const content = (() => {
    if (field.type === "tuple") {
      return (
        <TupleField<TValues>
          form={form}
          field={field}
          parentPath={path}
          values={values}
          fieldConfig={config}
          legacyFieldConfig={fallbackConfig}
          fieldComponent={fieldComponent}
        />
      );
    }

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
          duplicateLabel={arrayConfig?.duplicateLabel}
          moveUpLabel={arrayConfig?.moveUpLabel}
          moveDownLabel={arrayConfig?.moveDownLabel}
          emptyLabel={arrayConfig?.emptyLabel}
          minItems={arrayConfig?.minItems}
          maxItems={arrayConfig?.maxItems}
          reorderable={arrayConfig?.reorderable}
          itemLabel={
            arrayConfig?.itemLabel as
              string | ((item: unknown, index: number) => string) | undefined
          }
          createItem={() => getDefaultValue(itemField)}
        >
          {(_item, index) => {
            const itemPath = joinPath(path, index);
            const itemConfig = config?.item ?? config;

            if (
              config?.item !== undefined ||
              ["array", "tuple", "record", "union"].includes(itemField.type)
            ) {
              return (
                <FieldRenderer<TValues>
                  form={form}
                  field={{ ...itemField, name: String(index) }}
                  parentPath={path}
                  values={values}
                  fieldConfig={{
                    [index]: config?.item ?? (itemField.type === "array" ? undefined : config),
                  }}
                  legacyFieldConfig={fallbackConfig}
                  fieldComponent={fieldComponent}
                />
              );
            }

            if (itemField.type !== "object") {
              return (
                <Field<TValues>
                  form={form}
                  name={itemPath}
                  type={itemField.type}
                  config={
                    (itemField.options &&
                    !(itemConfig as InputFieldOptions<TValues, unknown>)?.options
                      ? {
                          ...itemConfig,
                          options: itemField.options.map((value) => ({ label: value, value })),
                        }
                      : itemConfig) as InputFieldOptions<TValues, unknown> | undefined
                  }
                  fieldComponent={fieldComponent}
                  state={resolveFieldState(
                    itemConfig as InputFieldOptions<TValues, unknown> | undefined,
                    values,
                  )}
                />
              );
            }

            return (
              <div className="erlform-array-item-content">
                <ObjectField<TValues>
                  form={form}
                  field={itemField}
                  parentPath={joinPath(path, index)}
                  fieldConfig={itemConfig}
                  legacyFieldConfig={fallbackConfig}
                  fieldComponent={fieldComponent}
                />
              </div>
            );
          }}
        </FieldArray>
      );
    }

    if (field.type === "record") {
      return (
        <RecordField<TValues>
          form={form}
          field={field}
          parentPath={path}
          fieldConfig={config}
          legacyFieldConfig={fallbackConfig}
          fieldComponent={fieldComponent}
        />
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
        values={conditionValues as TValues}
      />
    );
  })();

  return (
    <div className="erlform-field" style={layoutStyle}>
      {content}
    </div>
  );
}
