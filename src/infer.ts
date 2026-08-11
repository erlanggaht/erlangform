import { z } from "zod";
import type { FieldConfig } from "./types/field-options";

export type FieldMeta = {
  name: string;
  type: "string" | "number" | "boolean" | "array" | "object" | "unknown";

  fields?: FieldMeta[];
  item?: FieldMeta;

  config?: FieldConfig;
};

function inferField(name: string, field: any): FieldMeta {
  if (field instanceof z.ZodString || field instanceof z.ZodEmail) {
    return {
      name,
      type: "string",
    };
  }

  if (field instanceof z.ZodNumber) {
    return {
      name,
      type: "number",
    };
  }

  if (field instanceof z.ZodBoolean) {
    return {
      name,
      type: "boolean",
    };
  }

  if (field instanceof z.ZodObject) {
    return {
      name,
      type: "object",
      fields: infer(field),
    };
  }

  if (field instanceof z.ZodArray) {
    return {
      name,
      type: "array",
      item: inferField("item", field.element),
    };
  }

  return {
    name,
    type: "unknown",
  };
}

export function infer(schema: z.ZodObject) {
  return Object.entries(schema.shape).map(([name, field]) => inferField(name, field));
}
