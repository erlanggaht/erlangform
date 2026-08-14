export function joinPath(parent: string, child: string | number) {
  if (!parent) {
    return String(child);
  }

  if (typeof child === "number") {
    return `${parent}[${child}]`;
  }

  return `${parent}.${child}`;
}

export function getValueByPath(values: any, path: string): any {
  if (!path) {
    return values;
  }

  return path
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".")
    .filter(Boolean)
    .reduce((current, key) => {
      return current?.[key];
    }, values);
}
