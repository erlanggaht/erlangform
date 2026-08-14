import type { ComponentRegistry } from "@/types/component-registry";
import type { FieldConfig } from "@/types/field-options";
import { getValueByPath, joinPath } from "@/utils/field-path";
import { resolveFieldState } from "@/utils/resolve-field-state";
import { useEffect } from "react";
import { FieldArray } from "./field-array";
import { ObjectField } from "./field-object/FieldObject";
import { Field } from "./field/Field";

type FieldRendererProps = {
  form: any;
  field: any;
  values: any;
  fieldConfig?: FieldConfig;

  parentPath?: string;
  fieldComponent?: ComponentRegistry;
};

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

function getDefaultValue(field: any): any {
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
        (field.fields ?? []).map((child: any) => [child.name, getDefaultValue(child)]),
      );

    default:
      return "";
  }
}

export function FieldRenderer({
  form,
  field,
  values,
  fieldConfig,
  parentPath,
  fieldComponent,
}: FieldRendererProps) {
  const path = parentPath ? joinPath(parentPath, field.name) : field.name;
  const config = fieldConfig?.[field.name];
  const conditionValues = parentPath ? getValueByPath(values, parentPath) : values;
  const state = resolveFieldState(config, conditionValues);
  const layout = config?.layout;

  useEffect(() => {
    if (!state.visible && config?.clearOnHide) {
      form.setFieldValue(path, getEmptyValue(field.type));
    }
  }, [state.visible, config?.clearOnHide, form, path, field.type]);

  if (!state.visible) {
    return null;
  }

  const content = (() => {
    if (field.type === "array") {
      const arrayConfig = config?.array;

      return (
        <FieldArray
          form={form}
          name={path}
          addLabel={arrayConfig?.addLabel}
          removeLabel={arrayConfig?.removeLabel}
          createItem={() => getDefaultValue(field.item)}
        >
          {(_item: any, index: number) => {
            const itemLabel =
              typeof arrayConfig?.itemLabel === "function"
                ? arrayConfig.itemLabel(_item, index)
                : arrayConfig?.itemLabel
                  ? `${arrayConfig.itemLabel} ${index + 1}`
                  : `${field.name} ${index + 1}`;

            return (
              <div className="erlform-array-item-content">
                <h4 className="erlform-array-item-title">{itemLabel}</h4>

                <ObjectField
                  form={form}
                  field={field.item}
                  parentPath={joinPath(path, index)}
                  fieldConfig={fieldConfig}
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
        <ObjectField
          form={form}
          field={field}
          parentPath={path}
          fieldConfig={fieldConfig}
          fieldComponent={fieldComponent}
        />
      );
    }

    return (
      <Field
        form={form}
        name={path}
        type={field.type}
        config={config}
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
