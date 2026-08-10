import type { ComponentType } from "react";

export type FieldComponentProps = {
  field: any;
  config?: any;
};

export type ComponentRegistry = {
  string?: ComponentType<FieldComponentProps>;
  number?: ComponentType<FieldComponentProps>;
  boolean?: ComponentType<FieldComponentProps>;
};
