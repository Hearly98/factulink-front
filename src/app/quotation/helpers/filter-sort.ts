import { QuotationFilterForm } from '../core/types';

export function filterSort(formValue: Partial<QuotationFilterForm>) {
    return [
        {
            property: 'fecha_emision',
            direction: formValue.order,
        },
    ];
}
