import type { FieldOptions } from "@/types/field-options";

type Field = {
  name: string;
  type: string;
  [key: string]: any;
};

export type FieldGroup = {
  name?: string;
  fields: Field[];
};

export function groupFieldsBySection(
  fields: Field[],
  fieldConfig?: Record<string, FieldOptions>,
): FieldGroup[] {
  const groups: FieldGroup[] = [];

  for (const field of fields) {
    const section = fieldConfig?.[field.name]?.section;

    if (!section) {
      groups.push({
        name: undefined,
        fields: [field],
      });

      continue;
    }

    const existing = groups.find((group) => group.name === section);

    if (existing) {
      existing.fields.push(field);
    } else {
      groups.push({
        name: section,
        fields: [field],
      });
    }
  }

  return groups;
}
