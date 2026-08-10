import type { ComponentRegistry } from "@/types/component-registry";
import type { FieldConfig } from "@/types/field-options";
import { joinPath } from "@/utils/field-path";
import { resolveFieldState } from "@/utils/resolve-field-state";
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
  const state = resolveFieldState(config, values);
  const layout = config?.layout;

  if (!state.visible) {
    if (config?.clearOnHide) {
      // reset value
    }
    return null;
  }

  const content = (() => {
    if (field.type === "array") {
      return (
        <FieldArray form={form} name={path}>
          {(_item: any, index: number) => (
            <div>
              <h4>
                {field.name} {index + 1}
              </h4>

              <ObjectField form={form} field={field.item} parentPath={joinPath(path, index)} />
            </div>
          )}
        </FieldArray>
      );
    }

    if (field.type === "object") {
      return <ObjectField form={form} field={field} parentPath={path} />;
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
      style={{
        gridColumn: layout?.colSpan ? `span ${layout.colSpan}` : "span 12",
      }}
    >
      {content}
    </div>
  );
}
