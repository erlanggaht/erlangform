import { useStore } from "@tanstack/react-form";

type FieldArrayProps = {
  form: any;
  name: string;
  children: (item: any, index: number) => React.ReactNode;
};

export function FieldArray({ form, name, children }: FieldArrayProps) {
  const items = useStore(form.store, (state: any) => state.values[name] ?? []);
  function add(value = {}) {
    form.setFieldValue(name, [...items, value]);
  }

  function remove(index: number) {
    form.setFieldValue(
      name,
      items.filter((_: any, i: number) => i !== index),
    );
  }

  return (
    <div>
      {items.map((item: any, index: number) => (
        <div key={index}>
          {children(item, index)}

          <button type="button" onClick={() => remove(index)}>
            Remove
          </button>
        </div>
      ))}

      <button type="button" onClick={() => add({})}>
        Add
      </button>
    </div>
  );
}
