import { PurchaseFilterForm } from '../core/types';

export function filterSort(formValue: Partial<PurchaseFilterForm>) {
  return [
    {
      property: 'com_fecha',
      direction: formValue.order,
    },
  ];
}
