import { z } from "zod";

export type FieldMeta = {
  name: string;
  type: "string" | "number" | "boolean" | "array" | "object" | "unknown";

  fields?: FieldMeta[];
  item?: FieldMeta;
  options?: string[];
};

function unwrapField(field: z.ZodType): z.ZodType {
  let current = field;

  while (
    current instanceof z.ZodOptional ||
    current instanceof z.ZodNullable ||
    current instanceof z.ZodDefault ||
    current instanceof z.ZodCatch ||
    current instanceof z.ZodReadonly ||
    current instanceof z.ZodNonOptional ||
    current instanceof z.ZodPrefault
  ) {
    current = current.unwrap() as z.ZodType;
  }

  if (current instanceof z.ZodPipe) {
    return unwrapField(current._def.in as z.ZodType);
  }

  return current;
}

function inferField(name: string, inputField: z.ZodType): FieldMeta {
  const field = unwrapField(inputField);
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

  if (field instanceof z.ZodEnum) {
    const options = field.options;

    if (options.every((value): value is string => typeof value === "string")) {
      return { name, type: "string", options };
    }

    if (options.every((value) => typeof value === "number")) {
      return { name, type: "number" };
    }
  }

  if (field instanceof z.ZodLiteral) {
    const value = field.value;

    if (typeof value === "string") return { name, type: "string" };
    if (typeof value === "number") return { name, type: "number" };
    if (typeof value === "boolean") return { name, type: "boolean" };
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
