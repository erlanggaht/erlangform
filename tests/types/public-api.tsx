import { z } from "zod";
import type { ComponentRegistry, FieldConfig } from "@/index";

const schema = z.object({
  name: z.string(),
  tags: z.array(z.string()),
  profile: z.object({
    website: z.string().optional(),
  }),
});

type Values = z.infer<typeof schema>;

const fieldConfig = {
  name: {
    label: "Name",
    placeholder: "Your name",
  },
  tags: {
    array: {
      addLabel: "Add tag",
      removeLabel: "Remove tag",
    },
  },
  profile: {
    website: {
      type: "text",
      label: "Website",
    },
  },
} satisfies FieldConfig<Values>;

const fieldComponent = {
  string: ({ field, state }) => (
    <input
      id={field.name}
      value={field.state.value}
      disabled={state?.disabled}
      onChange={(event) => field.handleChange(event.target.value)}
    />
  ),
  select: ({ field }) => (
    <select
      id={field.name}
      value={field.state.value}
      onChange={(event) => field.handleChange(event.target.value)}
    />
  ),
} satisfies ComponentRegistry<Values>;

const customObject = {
  profile: {
    component: ({ field, values }) => (
      <div data-field={field.name}>{JSON.stringify(values)}</div>
    ),
  },
} satisfies FieldConfig<Values>;

void schema;
void fieldConfig;
void fieldComponent;
void customObject;
