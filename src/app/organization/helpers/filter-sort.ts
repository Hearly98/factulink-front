import { FilterForm } from '../core/types/filter-form';

export function filterSort(formValue: Partial<FilterForm>) {
  return [
    { property: 'emp_nom', direction: formValue.order },
  ];
}