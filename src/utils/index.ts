export * from "./messages";
export * from "./scoring";

type NoneType = null | undefined;

export function isNone(value: unknown): value is NoneType {
  return value === null || value === undefined;
}

/**
 * Log to console only in development mode
 * @param args Argument to be passed to `console.log`
 */
export function log(...args: any[]) {
  import.meta.env.DEV && console.log(...args);
}
