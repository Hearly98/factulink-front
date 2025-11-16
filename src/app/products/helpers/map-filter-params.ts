import { FilterForm } from "../core/types/filter-form";

export function mapParams(
    form: Partial<FilterForm>
): Partial<FilterForm> {
    return {
        prod_nom: form.prod_nom?.trim() ?? null,
        cat_id: form.cat_id ?? null,
        est: form.est ?? null,
        suc_id: form.suc_id ?? null,
    };
}

