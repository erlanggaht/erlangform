type FieldDescriptionProps = {
  config?: { descriptionClassName?: string };
  description?: string;
  id?: string;
};

export function FieldDescription({ config, description, id }: FieldDescriptionProps) {
  if (!description) {
    return null;
  }

  return (
    <small id={id} className={config?.descriptionClassName}>
      {description}
    </small>
  );
}
