import { infer } from "@/infer";
import type { ComponentRegistry } from "@/types/component-registry";
import type { FieldConfig } from "@/types/field-options";
import type { SectionConfigs } from "@/types/section-config";
import { groupFieldsBySection } from "@/utils/group-fields-by-section";
import { z } from "zod";
import { FieldRenderer } from "./FieldRenderer";
import { FieldSection } from "./field-section";

export type AutoFormProps<TValues = Record<string, unknown>> = {
  form: any;
  schema: z.ZodObject;
  fieldConfig?: FieldConfig<TValues>;
  fieldComponent?: ComponentRegistry<TValues>;
  sectionConfig?: SectionConfigs;
};

export function AutoForm<TValues = Record<string, unknown>>({
  form,
  schema,
  fieldConfig,
  fieldComponent,
  sectionConfig,
}: AutoFormProps<TValues>) {
  const fields = infer(schema);
  const groups = groupFieldsBySection(fields, fieldConfig);

  return (
    <form.Subscribe selector={(state: { values: TValues }) => state.values}>
      {(values: TValues) => (
        <div className="erlform-form">
          {groups.map((group, index) => {
            const fieldsContent = group.fields.map((field) => (
              <FieldRenderer<TValues>
                key={field.name}
                form={form}
                field={field}
                values={values}
                fieldConfig={fieldConfig}
                fieldComponent={fieldComponent}
              />
            ));

            if (!group.name) {
              return (
                <div key={`ungrouped-${index}`} className="erlform-grid">
                  {fieldsContent}
                </div>
              );
            }

            return (
              <FieldSection key={group.name} name={group.name} config={sectionConfig?.[group.name]}>
                {fieldsContent}
              </FieldSection>
            );
          })}
        </div>
      )}
    </form.Subscribe>
  );
}
