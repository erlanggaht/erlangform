import type { ComponentRegistry } from "@/types/component-registry";
import type { FieldConfig } from "@/types/field-options";
import type { FieldMeta } from "@/infer";
import { getValueByPath } from "@/utils/field-path";
import { FieldRenderer } from "../FieldRenderer";

type RecordFieldProps<TValues = Record<string, unknown>> = {
  form: any;
  field: FieldMeta;
  parentPath: string;
  fieldConfig?: unknown;
  legacyFieldConfig?: FieldConfig<TValues>;
  fieldComponent?: ComponentRegistry<TValues>;
};

export function RecordField<TValues = Record<string, unknown>>({
  form,
  field,
  parentPath,
  fieldConfig,
  legacyFieldConfig,
  fieldComponent,
}: RecordFieldProps<TValues>) {
  const value = getValueByPath(form.state.values, parentPath);
  const keys = value && typeof value === "object" ? Object.keys(value) : [];

  if (!field.item) {
    return null;
  }

  const itemField = field.item;

  return (
    <div className="erlform-record">
      {!keys.length && <div className="erlform-array-empty">No record entries yet.</div>}
      {keys.map((key) => (
        <FieldRenderer<TValues>
          key={key}
          form={form}
          field={{ ...itemField, name: key, type: itemField.type }}
          parentPath={parentPath}
          values={form.state.values}
          fieldConfig={fieldConfig}
          legacyFieldConfig={legacyFieldConfig}
          fieldComponent={fieldComponent}
        />
      ))}
    </div>
  );
}
