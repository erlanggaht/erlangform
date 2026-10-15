import { infer } from "@/infer";
import "@/styles/index.css";
import type { ReactFormExtendedApi } from "@tanstack/react-form";
import type { ComponentRegistry } from "@/types/component-registry";
import type { FieldConfig } from "@/types/field-options";
import type { SectionConfigs } from "@/types/section-config";
import { groupFieldsBySection } from "@/utils/group-fields-by-section";
import { z } from "zod";
import { FieldRenderer } from "./FieldRenderer";
import { FieldSection } from "./field-section";
import { useEffect, useState, type ReactNode } from "react";

export type FormStep<TValues = Record<string, unknown>> = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  fields: readonly (keyof TValues & string)[];
};

export type FormWizardOptions<TValues = Record<string, unknown>> = {
  steps: readonly FormStep<TValues>[];
  previousLabel?: string;
  nextLabel?: string;
  firstStepLabel?: string;
  lastStepLabel?: string;
  validateStep?: (step: number, values: TValues) => boolean | Promise<boolean>;
  onStepChange?: (step: number) => void;
};

export type ServerErrors = Record<string, string | readonly string[]>;

export type AutoFormProps<TValues = Record<string, unknown>> = {
  form: ReactFormExtendedApi<
    TValues,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any
  >;
  schema: z.ZodObject;
  fieldConfig?: FieldConfig<TValues>;
  fieldComponent?: ComponentRegistry<TValues>;
  sectionConfig?: SectionConfigs;
  onValuesChange?: (values: TValues) => void;
  wizard?: FormWizardOptions<TValues>;
  serverErrors?: ServerErrors;
};

type FormContentProps<TValues> = {
  values: TValues;
  fields: ReturnType<typeof infer>;
  form: AutoFormProps<TValues>["form"];
  fieldConfig?: FieldConfig<TValues>;
  fieldComponent?: ComponentRegistry<TValues>;
  sectionConfig?: SectionConfigs;
  onValuesChange?: (values: TValues) => void;
};

function FormContent<TValues>({
  values,
  fields,
  form,
  fieldConfig,
  fieldComponent,
  sectionConfig,
  onValuesChange,
}: FormContentProps<TValues>) {
  useEffect(() => {
    onValuesChange?.(values);
  }, [onValuesChange, values]);

  const groups = groupFieldsBySection(fields, fieldConfig);

  return (
    <div className="erlform-form">
      {groups.map((group, index) => {
        const fieldsContent = group.fields.map((field) => (
          <FieldRenderer<TValues>
            key={field.name}
            form={form}
            field={field}
            values={values}
            fieldConfig={fieldConfig}
            fieldComponent={fieldComponent}
          />
        ));

        if (!group.name) {
          return (
            <div key={`ungrouped-${index}`} className="erlform-grid">
              {fieldsContent}
            </div>
          );
        }

        return (
          <FieldSection key={group.name} name={group.name} config={sectionConfig?.[group.name]}>
            {fieldsContent}
          </FieldSection>
        );
      })}
    </div>
  );
}

export function AutoForm<TValues = Record<string, unknown>>({
  form,
  schema,
  fieldConfig,
  fieldComponent,
  sectionConfig,
  onValuesChange,
  wizard,
  serverErrors,
}: AutoFormProps<TValues>) {
  const fields = infer(schema);

  useEffect(() => {
    if (!serverErrors) {
      return;
    }

    for (const [fieldName, error] of Object.entries(serverErrors)) {
      const errors = Array.isArray(error) ? error : [error];
      form.setFieldMeta(
        fieldName as never,
        ((meta: { errors?: unknown[] }) => ({ ...meta, errors })) as never,
      );
    }
  }, [form, serverErrors]);
  const [activeStep, setActiveStep] = useState(0);
  const activeWizardStep = wizard?.steps[activeStep];
  const visibleFields = activeWizardStep
    ? fields.filter((field) => activeWizardStep.fields.includes(field.name as keyof TValues & string))
    : fields;

  async function changeStep(nextStep: number) {
    if (nextStep > activeStep && wizard?.validateStep) {
      const valid = await wizard.validateStep(activeStep, form.state.values as TValues);

      if (!valid) {
        return;
      }
    }

    const boundedStep = Math.max(0, Math.min(nextStep, (wizard?.steps.length ?? 1) - 1));
    setActiveStep(boundedStep);
    wizard?.onStepChange?.(boundedStep);
  }

  return (
    <>
      {wizard && activeWizardStep && (
        <div className="erlform-wizard-header" aria-live="polite">
          <div className="erlform-wizard-progress" aria-label="Form progress">
            {wizard.steps.map((step, index) => (
              <span
                key={step.id}
                className={index === activeStep ? "erlform-wizard-step-active" : undefined}
                aria-current={index === activeStep ? "step" : undefined}
              >
                {index + 1}. {step.title}
              </span>
            ))}
          </div>
          <h3>{activeWizardStep.title}</h3>
          {activeWizardStep.description && <p>{activeWizardStep.description}</p>}
        </div>
      )}

      <form.Subscribe selector={(state: { values: TValues }) => state.values}>
        {(values: TValues) => (
          <FormContent<TValues>
            values={values}
            fields={visibleFields}
            form={form}
            fieldConfig={fieldConfig}
            fieldComponent={fieldComponent}
            sectionConfig={sectionConfig}
            onValuesChange={onValuesChange}
          />
        )}
      </form.Subscribe>

      {wizard && activeWizardStep && (
        <div className="erlform-wizard-actions">
          <button
            type="button"
            disabled={activeStep === 0}
            onClick={() => void changeStep(activeStep - 1)}
          >
            {wizard.previousLabel ?? "Previous"}
          </button>
          {activeStep < wizard.steps.length - 1 && (
            <button type="button" onClick={() => void changeStep(activeStep + 1)}>
              {activeStep === 0 ? wizard.firstStepLabel ?? wizard.nextLabel ?? "Next" : wizard.nextLabel ?? "Next"}
            </button>
          )}
        </div>
      )}
    </>
  );
}
