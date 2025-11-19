import { FilterForm } from "../core/types/filter-form";

export function filterSort(formValue: Partial<FilterForm>) {
    return [
        {
            property: "tip_nom",
            direction: formValue.order,
        },
    ];
}
