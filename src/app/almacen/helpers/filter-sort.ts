import { FilterForm } from '../core/types';

export function filterSort(formValue: Partial<FilterForm>) {
    return [
        {
            property: "almacen_id",
            direction: formValue.order || 'desc',
        },
    ];
}
