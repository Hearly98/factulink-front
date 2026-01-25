import { SaleFilterForm } from '../core/types';

export function filterSort(formValue: Partial<SaleFilterForm>) {
  return [
    {
      property: 'fecha_emision',
      direction: formValue.order,
    },
  ];
}
