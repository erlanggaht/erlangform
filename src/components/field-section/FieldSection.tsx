import type { SectionConfig } from "@/types/section-config";
import type { ReactNode } from "react";

type FieldSectionProps = {
  name: string;
  config?: SectionConfig;
  children: ReactNode;
};

export function FieldSection({ name, config, children }: FieldSectionProps) {
  const title = config?.title ?? name;

  if (!config?.collapsible) {
    return (
      <section className={config?.className}>
        <header className={config?.headerClassName}>
          <h3 style={{ fontWeight: 600 }}>{title}</h3>

          {config?.description && <p>{config.description}</p>}
        </header>

        <div className={config?.contentClassName}>{children}</div>
      </section>
    );
  }

  return (
    <details className={config?.className} open={config?.defaultOpen}>
      <summary
        className={config?.headerClassName}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
      >
        <div>
          <h3 style={{ fontWeight: 600 }}>{title}</h3>

          {config?.description && <p>{config.description}</p>}
        </div>

        <span
          aria-hidden="true"
          style={{
            fontSize: 18,
            lineHeight: 1,
          }}
        >
          ⌄
        </span>
      </summary>

      <div className={config?.contentClassName}>{children}</div>
    </details>
  );
}
