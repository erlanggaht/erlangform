import type { ResolvedFieldOptions } from "@/types/field-options";

type FieldDescriptionProps = {
  config?: ResolvedFieldOptions;
  description?: string;
};

export function FieldDescription({ config, description }: FieldDescriptionProps) {
  if (!description) {
    return null;
  }

  return <small className={config?.descriptionClassName}>{description}</small>;
}
