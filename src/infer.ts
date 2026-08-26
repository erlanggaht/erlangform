import { z } from "zod";

export type FieldMeta = {
  name: string;
  type: "string" | "number" | "boolean" | "array" | "object" | "unknown";

  fields?: FieldMeta[];
  item?: FieldMeta;
};

function inferField(name: string, field: z.ZodType): FieldMeta {
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
      item: inferField("item", field.element as z.ZodType),
    };
  }

  return {
    name,
    type: "unknown",
  };
}

export function infer(schema: z.ZodObject): FieldMeta[] {
  return Object.entries(schema.shape).map(([name, field]) => inferField(name, field as z.ZodType));
}
