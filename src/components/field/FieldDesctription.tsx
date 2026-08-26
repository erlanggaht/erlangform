type FieldDescriptionProps = {
  config?: { descriptionClassName?: string };
  description?: string;
};

export function FieldDescription({ config, description }: FieldDescriptionProps) {
  if (!description) {
    return null;
  }

  return <small className={config?.descriptionClassName}>{description}</small>;
}
