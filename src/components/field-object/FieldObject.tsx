import type { ComponentRegistry } from "@/types/component-registry";
import type { FieldConfig } from "@/types/field-options";
import type { FieldMeta } from "@/infer";
import { FieldRenderer } from "../FieldRenderer";

type ObjectFieldProps<TValues = Record<string, unknown>> = {
  form: any;
  field: FieldMeta;
  parentPath?: string;
  fieldConfig?: unknown;
  legacyFieldConfig?: FieldConfig<TValues>;
  fieldComponent?: ComponentRegistry<TValues>;
};

export function ObjectField<TValues = Record<string, unknown>>({
  form,
  field,
  parentPath,
  fieldConfig,
  legacyFieldConfig,
  fieldComponent,
}: ObjectFieldProps<TValues>) {
  return (
    <div className="erlform-grid">
      {field.fields?.map((child) => (
        <FieldRenderer<TValues>
          key={child.name}
          form={form}
          field={child}
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
