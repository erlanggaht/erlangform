import type { FieldComponentProps } from "../types/component-registry";
import type { FormValues } from "./schema";

export function DemoTextField({ field, config, state }: FieldComponentProps<string, FormValues>) {
  const commonProps = {
    id: field.name,
    value: field.state.value ?? "",
    placeholder: config?.placeholder,
    disabled: state?.disabled,
    readOnly: state?.readOnly,
    required: state?.required,
    onBlur: () => field.handleBlur?.(),
    className: `erlform-native-control${config?.type === "textarea" ? " erlform-native-textarea" : ""}${config?.className ? ` ${config.className}` : ""}`,
  };

  if (config?.type === "textarea") {
    return (
      <textarea
        {...commonProps}
        rows={4}
        onChange={(event) => field.handleChange(event.target.value)}
      />
    );
  }

  return (
    <input
      {...commonProps}
      type={config?.type === "password" ? "password" : "text"}
      onChange={(event) => field.handleChange(event.target.value)}
    />
  );
}


