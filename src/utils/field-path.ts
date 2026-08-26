export function joinPath(parent: string, child: string | number) {
  if (!parent) {
    return String(child);
  }

  if (typeof child === "number") {
    return `${parent}[${child}]`;
  }

  return `${parent}.${child}`;
}

export function getValueByPath<TValues>(values: TValues, path: string): unknown {
  if (!path) {
    return values;
  }

  return path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean)
    .reduce<unknown>((current, key) => {
      if (current === null || typeof current !== "object") {
        return undefined;
      }

      return (current as Record<string, unknown>)[key];
    }, values);
}
