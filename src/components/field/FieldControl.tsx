import type { ComponentRegistry, FieldComponentApi } from "@/types/component-registry";
import type { ResolvedInputFieldOptions } from "@/types/field-options";
import type { FieldState } from "@/utils/resolve-field-state";
import { useEffect, type ComponentType } from "react";

type FieldControlProps<TValues = Record<string, unknown>, TValue = unknown> = {
  field: any;
  type: string;
  config?: ResolvedInputFieldOptions<TValues, TValue>;
  fieldComponent?: ComponentRegistry<TValues>;
  state: FieldState;
};

export function FieldControl<TValues = Record<string, unknown>, TValue = unknown>({
  field,
  type,
  config,
  state,
  fieldComponent,
}: FieldControlProps<TValues, TValue>) {
  const registryComponent = fieldComponent?.[
    type as keyof ComponentRegistry<TValues>
  ] as ComponentType<{
    field: FieldComponentApi<TValue>;
    config?: ResolvedInputFieldOptions<TValues, TValue>;
  }> | undefined;
  const Custom = config?.component ?? registryComponent;

  useEffect(() => {
    if (!config?.options) {
      return;
    }

    const currentValue = field.state.value;

    if (
      currentValue !== undefined &&
      currentValue !== "" &&
      !config.options.some((option) => option.value === currentValue)
    ) {
      field.handleChange("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config?.options, field.state.value]);

  if (Custom) {
    return (
      <Custom field={field as FieldComponentApi<TValue>} config={config} />
    );
  }

  switch (type) {
    case "string": {
      if (config?.options) {
        return (
          <select
            value={field.state.value ?? ""}
            required={state.required}
            disabled={state.disabled}
            className={config?.className}
            onChange={(e) => field.handleChange(e.target.value)}
          >
            {config.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      }

      if (config?.type === "textarea") {
        return (
          <textarea
            value={field.state.value ?? ""}
            placeholder={config.placeholder}
            required={state.required}
            disabled={state.disabled}
            readOnly={state.readOnly}
            className={config?.className}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        );
      }

      return (
        <div>
          <input
            type={config?.type === "password" ? "password" : "text"}
            value={field.state.value ?? ""}
            placeholder={config?.placeholder}
            required={state.required}
            disabled={state.disabled}
            readOnly={state.readOnly}
            className={config?.className}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        </div>
      );
    }

    case "number":
      return (
        <input
          type="number"
          value={field.state.value ?? ""}
          placeholder={config?.placeholder}
          required={state.required}
          disabled={state.disabled}
          readOnly={state.readOnly}
          className={config?.className}
          onChange={(e) => field.handleChange(Number(e.target.value))}
        />
      );

    case "boolean":
      return (
        <input
          type="checkbox"
          checked={field.state.value ?? false}
          required={state.required}
          disabled={state.disabled}
          readOnly={state.readOnly}
          className={config?.className}
          onChange={(e) => field.handleChange(e.target.checked)}
        />
      );

    default:
      return null;
  }
}
