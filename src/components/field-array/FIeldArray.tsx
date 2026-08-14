import { getValueByPath } from "@/utils/field-path";
import { useStore } from "@tanstack/react-form";
import type { ReactNode } from "react";

type FieldArrayProps = {
  form: any;
  name: string;
  addLabel?: string;
  removeLabel?: string;
  createItem?: () => any;
  children: (item: any, index: number) => ReactNode;
};

export function FieldArray({
  form,
  name,
  addLabel = "Add",
  removeLabel = "Remove",
  createItem = () => ({}),
  children,
}: FieldArrayProps) {
  const items = useStore(form.store, (state: any) => getValueByPath(state.values, name) ?? []);

  function add() {
    form.setFieldValue(name, [...items, createItem()]);
  }

  function remove(index: number) {
    form.setFieldValue(
      name,
      items.filter((_: any, i: number) => i !== index),
    );
  }

  return (
    <div className="erlform-array">
      {items.map((item: any, index: number) => (
        <div key={index} className="erlform-array-item">
          <div className="erlform-array-header">
            <span>Item {index + 1}</span>

            <button type="button" onClick={() => remove(index)}>
              {removeLabel}
            </button>
          </div>

          <div>{children(item, index)}</div>
        </div>
      ))}

      <button type="button" className="erlform-array-add" onClick={add}>
        {addLabel}
      </button>
    </div>
  );
}
