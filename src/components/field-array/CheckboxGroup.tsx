import type { SelectOption } from "@/types/select-options";

type CheckboxGroupProps<TValues = Record<string, unknown>> = {
  form: any;
  name: string;
  values: TValues;
  options: SelectOption[];
};

export function CheckboxGroup<TValues = Record<string, unknown>>({
  form,
  name,
  options,
}: CheckboxGroupProps<TValues>) {
  return (
    <form.Field name={name}>
      {(field: any) => {
        const selected = Array.isArray(field.state.value) ? field.state.value : [];

        return (
          <div role="group" aria-label={name} className="erlform-checkbox-group">
            {options.map((option) => {
              const checked = selected.includes(option.value);

              return (
                <label key={option.value} className="erlform-checkbox-option">
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={checked}
                    onChange={(event) => {
                      const next = event.target.checked
                        ? [...selected, option.value]
                        : selected.filter((value: string) => value !== option.value);
                      field.handleChange(next);
                    }}
                  />
                  <span>{option.label}</span>
                </label>
              );
            })}
          </div>
        );
      }}
    </form.Field>
  );
}
