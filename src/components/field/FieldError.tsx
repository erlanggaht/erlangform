import { normalizeError } from "@/utils/normalize-error";

type FieldErrorProps = {
  config?: { errorClassName?: string };
  errors?: unknown[];
  id?: string;
};

export function FieldError({ config, errors, id }: FieldErrorProps) {
  if (!errors?.length) {
    return null;
  }

  return (
    <span id={id} role="alert" className={`erlform-error ${config?.errorClassName ?? ""}`}>
      {normalizeError(errors[0])}
    </span>
  );
}
