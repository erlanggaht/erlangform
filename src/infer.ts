import { z } from "zod";

export type FieldMeta = {
  name: string;
  type:
    | "string"
    | "email"
    | "url"
    | "date"
    | "date-object"
    | "time"
    | "datetime"
    | "file"
    | "number"
    | "boolean"
    | "array"
    | "tuple"
    | "object"
    | "record"
    | "union"
    | "unknown";

  fields?: FieldMeta[];
  item?: FieldMeta;
  variants?: FieldMeta[];
  discriminator?: string;
  variantKeys?: string[];
  items?: FieldMeta[];
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

  if (current instanceof z.ZodLazy) {
    return unwrapField(current._def.getter() as z.ZodType);
  }

  return current;
}

function inferField(name: string, inputField: z.ZodType): FieldMeta {
  const field = unwrapField(inputField);
  if (field instanceof z.ZodEmail) {
    return { name, type: "email" };
  }

  if (field instanceof z.ZodURL) {
    return { name, type: "url" };
  }

  if (field instanceof z.ZodISODate) {
    return { name, type: "date" };
  }

  if (field instanceof z.ZodISOTime) {
    return { name, type: "time" };
  }

  if (field instanceof z.ZodISODateTime) {
    return { name, type: "datetime" };
  }

  if (field instanceof z.ZodDate) {
    return { name, type: "date-object" };
  }

  if (field instanceof z.ZodFile) {
    return { name, type: "file" };
  }

  if (field instanceof z.ZodString) {
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

    if (typeof value === "string") return { name, type: "string", options: [value] };
    if (typeof value === "number") return { name, type: "number" };
    if (typeof value === "boolean") return { name, type: "boolean" };
  }

  if (field instanceof z.ZodDiscriminatedUnion) {
    const definition = field._def as unknown as {
      discriminator: string;
      options: z.ZodType[];
    };
    const variantSchemas = definition.options;
    const variantKeys = variantSchemas.map((option) => {
      if (option instanceof z.ZodObject) {
        const discriminatorField = (option.shape as Record<string, z.ZodType>)[
          definition.discriminator
        ];

        if (discriminatorField instanceof z.ZodLiteral) {
          return String(discriminatorField.value);
        }
      }

      return "";
    });
    const variants = variantSchemas.map((option, index) =>
      inferField(`${name}-${index}`, option),
    );

    return {
      name,
      type: "union",
      variants,
      discriminator: definition.discriminator,
      variantKeys,
    };
  }

  if (field instanceof z.ZodUnion) {
    const variants = (field.options as unknown as z.ZodType[]).map((option, index) =>
      inferField(`${name}-${index}`, option),
    );
    const first = variants[0];

    if (first && variants.every((variant) => variant.type === first.type)) {
      const options = variants
        .flatMap((variant) => variant.options ?? [])
        .filter((value, index, all) => all.indexOf(value) === index);

      return {
        ...first,
        name,
        ...(options.length ? { options } : {}),
      };
    }

    return { name, type: "unknown", variants };
  }

  if (field instanceof z.ZodTuple) {
    const items = (field._def.items as unknown as z.ZodType[]).map((item, index) =>
      inferField(`${name}-${index}`, item),
    );

    return { name, type: "tuple", items };
  }

  if (field instanceof z.ZodIntersection) {
    const left = inferField(`${name}-left`, field._def.left as z.ZodType);
    const right = inferField(`${name}-right`, field._def.right as z.ZodType);

    if (left.type === "object" && right.type === "object") {
      return {
        name,
        type: "object",
        fields: [...(left.fields ?? []), ...(right.fields ?? [])],
      };
    }

    if (left.type === right.type) {
      return { ...left, name };
    }

    return { name, type: "unknown", variants: [left, right] };
  }

  if (field instanceof z.ZodObject) {
    return {
      name,
      type: "object",
      fields: infer(field),
    };
  }

  if (field instanceof z.ZodRecord) {
    return {
      name,
      type: "record",
      item: inferField("value", field._def.valueType as z.ZodType),
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
