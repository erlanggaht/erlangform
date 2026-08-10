import type { ResolvedFieldOptions } from "@/types/field-options";
import { normalizeError } from "@/utils/normalize-error";

type FieldErrorProps = {
  config?: ResolvedFieldOptions;
  errors?: unknown[];
};

export function FieldError({ config, errors }: FieldErrorProps) {
  if (!errors?.length) {
    return null;
  }

  return <p className={config?.descriptionClassName}>{normalizeError(errors[0])}</p>;
}
