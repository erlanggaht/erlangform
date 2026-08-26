export type Resolver<T, TValues = Record<string, unknown>> = T | ((values: TValues) => T);
