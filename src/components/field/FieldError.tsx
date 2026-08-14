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

  return (
    <span className={`erlform-error ${config?.errorClassName ?? ""}`}>
      {normalizeError(errors[0])}
    </span>
  );
}
