# ErlForm demo

App.tsx opens DemoPage. Each file has one responsibility:

| File              | Purpose                                            |
| ----------------- | -------------------------------------------------- |
| DemoPage.tsx      | Form state, validation, submit, sample data, reset |
| schema.ts         | Zod schema and inferred FormValues type            |
| default-values.ts | Empty defaults and valid sample data               |
| field-config.ts   | Labels, options, visibility, array actions         |
| section-config.ts | Section titles and descriptions                    |
| wizard.ts         | Steps and their field lists                        |
| DemoTextField.tsx | Custom text component with shared control styles   |
| SubmitResult.tsx  | Submitted JSON, file details, usage hints          |
| demo.css          | Scoped demo page styles                            |

To add a field, add its schema and initial value, configure it in field-config.ts,
and include it in a wizard step. Set a section key to group related examples.
All steps are navigable; submission validates the full schema.
Library components and default styles remain in src/components and src/styles.
