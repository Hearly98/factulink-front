import { FilterForm } from "../core/types";

export function filterSort(formValue: Partial<FilterForm>) {
    return [
        {
            property: "usu_nom",
            direction: formValue.order,
        },
    ];
}
