import { FieldRenderer } from "../FieldRenderer";

type ObjectFieldProps = {
  form: any;
  field: any;
  parentPath?: string;
};

export function ObjectField({ form, field, parentPath }: ObjectFieldProps) {
  return (
    <div>
      {field.fields?.map((child: any) => (
        <FieldRenderer
          key={child.name}
          form={form}
          field={child}
          parentPath={parentPath}
          values={form.state.values}
        />
      ))}
    </div>
  );
}
