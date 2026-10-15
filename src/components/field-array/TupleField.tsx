import type { ComponentRegistry } from "@/types/component-registry";
import type { FieldConfig, InputFieldOptions } from "@/types/field-options";
import type { FieldMeta } from "@/infer";
import { joinPath } from "@/utils/field-path";
import { FieldRenderer } from "../FieldRenderer";
import { ObjectField } from "../field-object/FieldObject";
import { Field } from "../field/Field";
import { resolveFieldState } from "@/utils/resolve-field-state";

type TupleFieldProps<TValues = Record<string, unknown>> = {
  form: any;
  field: FieldMeta;
  parentPath: string;
  values: TValues;
  fieldConfig?: unknown;
  legacyFieldConfig?: FieldConfig<TValues>;
  fieldComponent?: ComponentRegistry<TValues>;
};

export function TupleField<TValues = Record<string, unknown>>({
  form,
  field,
  parentPath,
  values,
  fieldConfig,
  legacyFieldConfig,
  fieldComponent,
}: TupleFieldProps<TValues>) {
  return (
    <div className="erlform-tuple">
      {(field.items ?? []).map((item, index) => {
        const itemPath = joinPath(parentPath, index);
        const itemField = { ...item, name: String(index) };

        if (item.type === "object") {
          return (
            <ObjectField<TValues>
              key={itemPath}
              form={form}
              field={itemField}
              parentPath={itemPath}
              fieldConfig={fieldConfig}
              legacyFieldConfig={legacyFieldConfig}
              fieldComponent={fieldComponent}
            />
          );
        }

        if (item.type === "array" || item.type === "tuple" || item.type === "record") {
          return (
            <FieldRenderer<TValues>
              key={itemPath}
              form={form}
              field={itemField}
              values={values}
              fieldConfig={fieldConfig}
              legacyFieldConfig={legacyFieldConfig}
              parentPath={parentPath}
              fieldComponent={fieldComponent}
            />
          );
        }

        return (
          <Field<TValues>
            key={itemPath}
            form={form}
            name={itemPath}
            type={item.type}
            config={fieldConfig as InputFieldOptions<TValues, unknown> | undefined}
            state={resolveFieldState(undefined, values)}
            fieldComponent={fieldComponent}
          />
        );
      })}
    </div>
  );
}
