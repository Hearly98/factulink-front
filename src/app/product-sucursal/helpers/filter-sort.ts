import { FilterForm } from '../core/types';

export function filterSort(formValue: Partial<FilterForm>) {
    return [
        {
            property: "prodsuc_id",
            direction: (formValue as any).order || 'desc',
        },
    ];
}
