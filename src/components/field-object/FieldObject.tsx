import type { ComponentRegistry } from "@/types/component-registry";
import type { FieldConfig } from "@/types/field-options";
import { FieldRenderer } from "../FieldRenderer";

type ObjectFieldProps = {
  form: any;
  field: any;
  parentPath?: string;
  fieldConfig?: FieldConfig;
  fieldComponent?: ComponentRegistry;
};

export function ObjectField({
  form,
  field,
  parentPath,
  fieldConfig,
  fieldComponent,
}: ObjectFieldProps) {
  return (
    <div>
      {field.fields?.map((child: any) => (
        <FieldRenderer
          key={child.name}
          form={form}
          field={child}
          parentPath={parentPath}
          values={form.state.values}
          fieldConfig={fieldConfig}
          fieldComponent={fieldComponent}
        />
      ))}
    </div>
  );
}
