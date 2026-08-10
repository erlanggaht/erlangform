import type { ComponentRegistry } from "@/types/component-registry";
import type { ResolvedFieldOptions } from "@/types/field-options";
import type { FieldState } from "@/utils/resolve-field-state";

type FieldControlProps = {
  field: any;
  type: string;
  config?: ResolvedFieldOptions;
  fieldComponent?: ComponentRegistry;
  state: FieldState;
};

export function FieldControl({ field, type, config, state, fieldComponent }: FieldControlProps) {
  const Custom = config?.component ?? fieldComponent?.[type as keyof ComponentRegistry];

  if (Custom) {
    return <Custom field={field} config={config} />;
  }

  switch (type) {
    case "string": {
      if (config?.options) {
        return (
          <select
            value={field.state.value ?? ""}
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
