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

function formatDateValue(value: unknown) {
  if (!(value instanceof Date)) {
    return typeof value === "string" ? value : "";
  }

  if (Number.isNaN(value.getTime())) return "";
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${String(value.getFullYear()).padStart(4, "0")}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
}

function formatLocalDateTime(value: unknown) {
  if (!value) return "";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return "";
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function FieldControl<TValues = Record<string, unknown>, TValue = unknown>({
  field,
  type,
  config,
  state,
  fieldComponent,
}: FieldControlProps<TValues, TValue>) {
  const hasErrors = field.state.meta.errors?.length > 0;
  const hasDescription = Boolean(config?.description);
  const accessibilityProps = {
    "aria-invalid": hasErrors || undefined,
    "aria-describedby":
      [
        hasDescription ? `${field.name}-description` : undefined,
        hasErrors ? `${field.name}-error` : undefined,
      ]
        .filter(Boolean)
        .join(" ") || undefined,
    "aria-required": state.required || undefined,
  };
  const registryKey = config?.options ? "select" : type;
  const registryComponent = fieldComponent?.[registryKey as keyof ComponentRegistry<TValues>] as
    | ComponentType<{
        field: FieldComponentApi<TValue>;
        config?: ResolvedInputFieldOptions<TValues, TValue>;
        state?: FieldState;
      }>
    | undefined;
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
    return <Custom field={field as FieldComponentApi<TValue>} config={config} state={state} />;
  }

  switch (type) {
    case "string":
    case "email":
    case "url": {
      if (config?.type === "radio" && config.options) {
        return (
          <div role="radiogroup" aria-invalid={accessibilityProps["aria-invalid"]}>
            {config.options.map((option) => (
              <label key={option.value} className="erlform-radio-option">
                <input
                  type="radio"
                  name={field.name}
                  value={option.value}
                  checked={field.state.value === option.value}
                  required={state.required}
                  disabled={state.disabled}
                  onChange={() => field.handleChange(option.value)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );
      }

      if (config?.options) {
        return (
          <select
            id={field.name}
            value={field.state.value ?? ""}
            required={state.required}
            disabled={state.disabled}
            aria-readonly={state.readOnly || undefined}
            className={nativeClassName(
              config?.className
                ? `${config.className} erlform-native-select`
                : "erlform-native-select",
            )}
            {...accessibilityProps}
            onChange={state.readOnly ? undefined : (e) => field.handleChange(e.target.value)}
          >
            <option value="" disabled>
              {config.placeholder ?? "Pilih opsi"}
            </option>
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
              config?.className
                ? `${config.className} erlform-native-textarea`
                : "erlform-native-textarea",
            )}
            {...accessibilityProps}
            onChange={(e) => field.handleChange(e.target.value)}
          />
        );
      }

      return (
        <div>
          <input
            id={field.name}
            type={
              config?.type === "password"
                ? "password"
                : config?.type === "range" || config?.type === "color"
                  ? config.type
                  : type === "email" || type === "url"
                    ? type
                    : "text"
            }
            value={field.state.value ?? ""}
            placeholder={config?.placeholder}
            min={config?.min}
            max={config?.max}
            step={config?.step}
            accept={config?.accept}
            multiple={config?.multiple}
            required={state.required}
            disabled={state.disabled}
            readOnly={state.readOnly}
            className={nativeClassName(config?.className)}
            {...accessibilityProps}
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
          min={config?.min}
          max={config?.max}
          step={config?.step}
          required={state.required}
          disabled={state.disabled}
          readOnly={state.readOnly}
          className={nativeClassName(config?.className)}
          {...accessibilityProps}
          onChange={(e) => {
            const value = e.target.value;
            field.handleChange(value === "" ? undefined : Number(value));
          }}
        />
      );

    case "date":
    case "time":
    case "datetime": {
      const inputType = type === "datetime" ? "datetime-local" : type;

      return (
        <input
          id={field.name}
          type={inputType}
          value={
            type === "datetime" ? formatLocalDateTime(field.state.value) : (field.state.value ?? "")
          }
          placeholder={config?.placeholder}
          required={state.required}
          disabled={state.disabled}
          readOnly={state.readOnly}
          className={nativeClassName(config?.className)}
          {...accessibilityProps}
          onChange={(event) => {
            const value = event.target.value;
            field.handleChange(
              type === "datetime" ? (value ? new Date(value).toISOString() : undefined) : value,
            );
          }}
        />
      );
    }

    case "date-object":
      return (
        <input
          id={field.name}
          type="date"
          value={formatDateValue(field.state.value)}
          required={state.required}
          disabled={state.disabled}
          readOnly={state.readOnly}
          className={nativeClassName(config?.className)}
          {...accessibilityProps}
          onChange={(event) =>
            field.handleChange(
              event.target.value ? new Date(`${event.target.value}T00:00:00`) : undefined,
            )
          }
        />
      );

    case "file":
      return (
        <input
          id={field.name}
          type="file"
          required={state.required}
          disabled={state.disabled}
          className={nativeClassName(config?.className)}
          {...accessibilityProps}
          onChange={(event) => field.handleChange(event.target.files?.[0])}
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
          {...accessibilityProps}
          onChange={(e) => field.handleChange(e.target.checked)}
        />
      );

    default:
      return null;
  }
}
