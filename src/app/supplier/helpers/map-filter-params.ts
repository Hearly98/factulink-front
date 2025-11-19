import { FilterForm } from "../core/types/filter-form";

export function mapParams(
    form: Partial<FilterForm>
): Partial<FilterForm> {
    return {
        prov_nom: form.prov_nom?.trim() ?? null,
        order: form.order ?? null,
    };
}