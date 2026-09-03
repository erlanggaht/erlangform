import type { ComponentRegistry } from "@/types/component-registry";
import type { InputFieldOptions } from "@/types/field-options";
import { resolveFieldConfig } from "@/utils/resolve-field";
import type { FieldState } from "@/utils/resolve-field-state";
import { FieldControl } from "./FieldControl";
import { FieldDescription } from "./FieldDesctription";
import { FieldError } from "./FieldError";
import { FieldLabel } from "./FieldLabel";

type FieldProps<TValues = Record<string, unknown>, TValue = unknown> = {
  form: any;
  name: string;
  type: string;
  config?: InputFieldOptions<TValues, TValue>;
  state: FieldState;
  fieldComponent?: ComponentRegistry<TValues>;
};

export function Field<TValues = Record<string, unknown>, TValue = unknown>({
  form,
  name,
  type,
  config,
  state,
  fieldComponent,
}: FieldProps<TValues, TValue>) {
  const resolvedConfig = resolveFieldConfig(config, form.state.values as TValues);

  return (
    <form.Field name={name}>
      {(field: any) => {
        if (type === "boolean") {
          return (
            <div className={`erlform-checkbox-field ${config?.wrapperClassName}`}>
              <FieldControl
                config={resolvedConfig}
                field={field}
                type={type}
                fieldComponent={fieldComponent}
                state={state}
              />

              <FieldLabel config={resolvedConfig} state={state} />

              <FieldError config={resolvedConfig} errors={field.state.meta.errors} />
            </div>
          );
        }

        return (
          <div className={config?.wrapperClassName}>
            <FieldLabel config={resolvedConfig} state={state} />

            <FieldDescription config={resolvedConfig} description={resolvedConfig?.description} />

            <FieldControl
              config={resolvedConfig}
              field={field}
              type={type}
              fieldComponent={fieldComponent}
              state={state}
            />

            <FieldError config={resolvedConfig} errors={field.state.meta.errors} />
          </div>
        );
      }}
    </form.Field>
  );
}
