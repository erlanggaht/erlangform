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

function nativeClassName(className?: string) {
  return `erlform-native-control${className ? ` ${className}` : ""}`;
}

export function FieldControl<TValues = Record<string, unknown>, TValue = unknown>({
  field,
  type,
  config,
  state,
  fieldComponent,
}: FieldControlProps<TValues, TValue>) {
  const registryKey = config?.options ? "select" : type;
  const registryComponent = fieldComponent?.[
    registryKey as keyof ComponentRegistry<TValues>
  ] as ComponentType<{
    field: FieldComponentApi<TValue>;
    config?: ResolvedInputFieldOptions<TValues, TValue>;
    state?: FieldState;
  }> | undefined;
  const stringFallback = fieldComponent?.string as unknown as typeof registryComponent;
  const Custom =
    config?.component ??
    registryComponent ??
    (config?.options ? stringFallback : undefined);

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
      <Custom field={field as FieldComponentApi<TValue>} config={config} state={state} />
    );
  }

  switch (type) {
    case "string": {
      if (config?.options) {
        return (
          <select
            id={field.name}
            value={field.state.value ?? ""}
            required={state.required}
            disabled={state.disabled}
            aria-readonly={state.readOnly || undefined}
            className={nativeClassName(
              config?.className ? `${config.className} erlform-native-select` : "erlform-native-select",
            )}
            onChange={
              state.readOnly ? undefined : (e) => field.handleChange(e.target.value)
            }
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
            id={field.name}
            value={field.state.value ?? ""}
            placeholder={config.placeholder}
            required={state.required}
            disabled={state.disabled}
            readOnly={state.readOnly}
            className={nativeClassName(
              config?.className ? `${config.className} erlform-native-textarea` : "erlform-native-textarea",
            )}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        );
      }

      return (
        <div>
          <input
            id={field.name}
            type={config?.type === "password" ? "password" : "text"}
            value={field.state.value ?? ""}
            placeholder={config?.placeholder}
            required={state.required}
            disabled={state.disabled}
            readOnly={state.readOnly}
            className={nativeClassName(config?.className)}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        </div>
      );
    }

    case "number":
      return (
        <input
          id={field.name}
          type="number"
          value={field.state.value ?? ""}
          placeholder={config?.placeholder}
          required={state.required}
          disabled={state.disabled}
          readOnly={state.readOnly}
          className={nativeClassName(config?.className)}
          onChange={(e) => {
            const value = e.target.value;
            field.handleChange(value === "" ? undefined : Number(value));
          }}
        />
      );

    case "boolean":
      return (
        <input
          id={field.name}
          type="checkbox"
          checked={field.state.value ?? false}
          required={state.required}
          disabled={state.disabled}
          readOnly={state.readOnly}
          className={nativeClassName(config?.className)}
          onChange={(e) => field.handleChange(e.target.checked)}
        />
      );

    default:
      return null;
  }
}
