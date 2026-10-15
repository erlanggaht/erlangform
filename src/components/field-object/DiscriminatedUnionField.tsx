import type { ComponentRegistry } from "@/types/component-registry";
import type { FieldConfig } from "@/types/field-options";
import type { FieldMeta } from "@/infer";
import { getValueByPath } from "@/utils/field-path";
import { ObjectField } from "./FieldObject";

type DiscriminatedUnionFieldProps<TValues = Record<string, unknown>> = {
  form: any;
  field: FieldMeta;
  parentPath: string;
  fieldConfig?: unknown;
  legacyFieldConfig?: FieldConfig<TValues>;
  fieldComponent?: ComponentRegistry<TValues>;
};

export function DiscriminatedUnionField<TValues = Record<string, unknown>>({
  form,
  field,
  parentPath,
  fieldConfig,
  legacyFieldConfig,
  fieldComponent,
}: DiscriminatedUnionFieldProps<TValues>) {
  const value = getValueByPath(form.state.values, parentPath);
  const discriminatorValue =
    value && typeof value === "object" && field.discriminator
      ? (value as Record<string, unknown>)[field.discriminator]
      : undefined;
  const variantIndex = field.variantKeys?.indexOf(String(discriminatorValue)) ?? -1;
  const variant = field.variants?.[variantIndex >= 0 ? variantIndex : 0];

  if (!variant) {
    return null;
  }

  return (
    <div className="erlform-union">
      <ObjectField<TValues>
        form={form}
        field={variant}
        parentPath={parentPath}
        fieldConfig={fieldConfig}
        legacyFieldConfig={legacyFieldConfig}
        fieldComponent={fieldComponent}
      />
    </div>
  );
}
