import { FilterForm } from '../core/types/filter-form';

export function filterSort(formValue: Partial<FilterForm>) {
  return [
    { property: 'mon_nom', direction: formValue.order },
  ];
}