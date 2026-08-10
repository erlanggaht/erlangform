export type SectionConfig = {
  title?: string;
  description?: string;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
};

export type SectionConfigs = Record<string, SectionConfig>;
