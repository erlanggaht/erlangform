import { getValueByPath } from "@/utils/field-path";
import { useStore } from "@tanstack/react-form";
import { useState, type ReactNode } from "react";

type FieldArrayProps<TItem = unknown> = {
  form: any;
  name: string;
  addLabel?: string;
  removeLabel?: string;
  duplicateLabel?: string;
  moveUpLabel?: string;
  moveDownLabel?: string;
  emptyLabel?: string;
  minItems?: number;
  maxItems?: number;
  reorderable?: boolean;
  itemLabel?: ReactNode | ((item: TItem, index: number) => ReactNode);
  createItem?: () => TItem;
  children: (item: TItem, index: number) => ReactNode;
};

export function FieldArray<TItem = unknown>({
  form,
  name,
  addLabel = "Add",
  removeLabel = "Remove",
  duplicateLabel = "Duplicate",
  moveUpLabel = "Move up",
  moveDownLabel = "Move down",
  emptyLabel = "No items yet.",
  minItems = 0,
  maxItems,
  reorderable = false,
  itemLabel = (_, index) => `Item #${index + 1}`,
  createItem,
  children,
}: FieldArrayProps<TItem>) {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const items = useStore(form.store, (state: { values: unknown }) => {
    const value = getValueByPath(state.values, name);
    return Array.isArray(value) ? (value as TItem[]) : [];
  });

  function add() {
    if (maxItems !== undefined && items.length >= maxItems) {
      return;
    }

    form.setFieldValue(name, [...items, createItem ? createItem() : ({} as TItem)]);
  }

  function remove(index: number) {
    if (items.length <= minItems) {
      return;
    }

    form.setFieldValue(
      name,
      items.filter((_: TItem, i: number) => i !== index),
    );
  }

  function duplicate(index: number) {
    if (maxItems !== undefined && items.length >= maxItems) {
      return;
    }

    form.setFieldValue(name, [...items.slice(0, index + 1), items[index], ...items.slice(index + 1)]);
  }

  function move(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;

    if (nextIndex < 0 || nextIndex >= items.length) {
      return;
    }

    const nextItems = [...items];
    [nextItems[index], nextItems[nextIndex]] = [nextItems[nextIndex], nextItems[index]];
    form.setFieldValue(name, nextItems);
  }

  function moveTo(index: number, targetIndex: number) {
    if (index === targetIndex || targetIndex < 0 || targetIndex >= items.length) {
      return;
    }

    const nextItems = [...items];
    const [movedItem] = nextItems.splice(index, 1);
    nextItems.splice(targetIndex, 0, movedItem);
    form.setFieldValue(name, nextItems);
  }

  return (
    <div className="erlform-array">
      {!items.length && <div className="erlform-array-empty">{emptyLabel}</div>}

      {items.map((item: TItem, index: number) => (
        <div
          key={index}
          className={`erlform-array-item${reorderable ? " erlform-array-item-draggable" : ""}`}
          draggable={reorderable}
          onDragStart={() => reorderable && setDraggingIndex(index)}
          onDragOver={(event) => {
            if (reorderable) {
              event.preventDefault();
            }
          }}
          onDrop={() => {
            if (reorderable && draggingIndex !== null) {
              moveTo(draggingIndex, index);
              setDraggingIndex(null);
            }
          }}
          onDragEnd={() => setDraggingIndex(null)}
        >
          <div className="erlform-array-header">
            <div className="erlform-array-item-title">
              {typeof itemLabel === "function"
                ? itemLabel(item, index)
                : typeof itemLabel === "string"
                  ? `${itemLabel} #${index + 1}`
                  : itemLabel}
            </div>

            <div className="erlform-array-actions">
              <button type="button" disabled={index === 0} onClick={() => move(index, -1)}>
                {moveUpLabel}
              </button>
              <button
                type="button"
                disabled={index === items.length - 1}
                onClick={() => move(index, 1)}
              >
                {moveDownLabel}
              </button>
              <button type="button" disabled={items.length >= (maxItems ?? Infinity)} onClick={() => duplicate(index)}>
                {duplicateLabel}
              </button>
              <button type="button" disabled={items.length <= minItems} onClick={() => remove(index)}>
                {removeLabel}
              </button>
            </div>
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
