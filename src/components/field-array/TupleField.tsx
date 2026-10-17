import type { FieldMeta } from "@/infer";
import type { ComponentRegistry } from "@/types/component-registry";
import type { FieldConfig } from "@/types/field-options";
import { joinPath } from "@/utils/field-path";
import { FieldRenderer } from "../FieldRenderer";

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

        return (
          <FieldRenderer<TValues>
            key={itemPath}
            form={form}
            field={itemField}
            values={values}
            parentPath={parentPath}
            fieldConfig={fieldConfig}
            legacyFieldConfig={legacyFieldConfig}
            fieldComponent={fieldComponent}
          />
        );
      })}
    </div>
  );
}
