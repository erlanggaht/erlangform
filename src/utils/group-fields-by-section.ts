import type { FieldMeta } from "@/infer";
import type { FieldConfig } from "@/types/field-options";

export type FieldGroup = {
  name?: string;
  fields: FieldMeta[];
};

export function groupFieldsBySection<TValues>(
  fields: FieldMeta[],
  fieldConfig?: FieldConfig<TValues>,
): FieldGroup[] {
  const groups: FieldGroup[] = [];

  for (const field of fields) {
    const section = (
      fieldConfig as unknown as Record<string, { section?: string } | undefined>
    )?.[field.name]?.section;

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
