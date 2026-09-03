import { getValueByPath } from "@/utils/field-path";
import { useStore } from "@tanstack/react-form";
import type { ReactNode } from "react";

type FieldArrayProps<TItem = unknown> = {
  form: any;
  name: string;
  addLabel?: string;
  removeLabel?: string;
  itemLabel?: ReactNode | ((item: TItem, index: number) => ReactNode);
  createItem?: () => TItem;
  children: (item: TItem, index: number) => ReactNode;
};

export function FieldArray<TItem = unknown>({
  form,
  name,
  addLabel = "Add",
  removeLabel = "Remove",
  itemLabel = (_, index) => `Item #${index + 1}`,
  createItem,
  children,
}: FieldArrayProps<TItem>) {
  const items = useStore(form.store, (state: { values: unknown }) => {
    const value = getValueByPath(state.values, name);
    return Array.isArray(value) ? (value as TItem[]) : [];
  });

  function add() {
    form.setFieldValue(name, [...items, createItem ? createItem() : ({} as TItem)]);
  }

  function remove(index: number) {
    form.setFieldValue(
      name,
      items.filter((_, i: number) => i !== index),
    );
  }

  return (
    <div className="erlform-array">
      {items.map((item, index: number) => (
        <div key={index} className="erlform-array-item">
          <div className="erlform-array-header">
            <div className="erlform-array-item-title">
              {typeof itemLabel === "function"
                ? itemLabel(item, index)
                : typeof itemLabel === "string"
                  ? `${itemLabel} #${index + 1}`
                  : itemLabel}
            </div>

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
