import { infer } from "@/infer";
import type { ComponentRegistry } from "@/types/component-registry";
import type { FieldConfig } from "@/types/field-options";
import type { SectionConfigs } from "@/types/section-config";
import { groupFieldsBySection } from "@/utils/group-fields-by-section";
import { z } from "zod";
import { FieldRenderer } from "./FieldRenderer";
import { FieldSection } from "./field-section";

type AutoFormProps = {
  form: any;
  schema: z.ZodObject;
  fieldConfig?: FieldConfig;
  fieldComponent?: ComponentRegistry;
  sectionConfig?: SectionConfigs;
};

export function AutoForm({
  form,
  schema,
  fieldConfig,
  fieldComponent,
  sectionConfig,
}: AutoFormProps) {
  const fields = infer(schema);
  const groups = groupFieldsBySection(fields, fieldConfig);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {groups.map((group, index) => {
        const fieldsContent = (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
              gap: 16,
            }}
          >
            {group.fields.map((field) => (
              <FieldRenderer
                key={field.name}
                form={form}
                field={field}
                values={form.state.values}
                fieldConfig={fieldConfig}
                fieldComponent={fieldComponent}
              />
            ))}
          </div>
        );

        if (!group.name) {
          return <div key={`ungrouped-${index}`}>{fieldsContent}</div>;
        }

        return (
          <FieldSection key={group.name} name={group.name} config={sectionConfig?.[group.name]}>
            {fieldsContent}
          </FieldSection>
        );
      })}
    </div>
  );
}
