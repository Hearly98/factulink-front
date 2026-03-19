import { FilterForm } from '../core/types/filter-form';

export function filterSort(value: Partial<FilterForm>) {
  return [
    {
      property: "createdAt",
      direction: value.order
    }
  ]
};
