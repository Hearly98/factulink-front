import { SelectOption } from "@shared/types";

export function mapToSelectOption<T>(
  items: T[],
  valueKey: keyof T,
  labelKey: keyof T
): SelectOption[] {
  return items.map(item => ({
    value: item[valueKey] as string | number | boolean,
    label: item[labelKey] as string
  }));
}