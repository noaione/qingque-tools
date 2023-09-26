export * from "./scoring";

type NoneType = null | undefined;

export function isNone(value: unknown): value is NoneType {
  return value === null || value === undefined;
}
