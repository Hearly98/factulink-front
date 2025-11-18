import { FilterForm } from "../core/types/filter-form";

export function mapParams(
    form: Partial<FilterForm>
): Partial<FilterForm> {
    return {
        cli_nom: form.cli_nom?.trim() ?? null,
        order: form.order ?? null,
    };
}