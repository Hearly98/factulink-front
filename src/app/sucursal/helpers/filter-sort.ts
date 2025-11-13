import { FilterForm } from '../core/types';

export function filterSort(formValue: Partial<FilterForm>) {
    return [
        {
            property: "suc_nom",
            direction: formValue.order,
        },
    ];
}
