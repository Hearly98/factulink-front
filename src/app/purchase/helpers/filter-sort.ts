import { PurchaseFilterForm } from '../core/types';

export function filterSort(formValue: Partial<PurchaseFilterForm>) {
  return [
    {
      property: 'fechaEmision',
      direction: formValue.order,
    },
  ];
}
