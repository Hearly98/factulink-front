import { FilterForm } from "../core/types/filter-form";

export function mapParams(
    form: Partial<FilterForm>
): Partial<FilterForm> {
    return {
        cat_nom: form.cat_nom?.trim() ?? null,
        est: form.est ?? null,
    };
}
