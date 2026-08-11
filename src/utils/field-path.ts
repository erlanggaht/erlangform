export function joinPath(parent: string, child: string | number) {
  return parent ? `${parent}.${child}` : String(child);
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
