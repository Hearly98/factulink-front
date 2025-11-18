import { FilterForm } from "../core/types";

export function mapParams(
    form: Partial<FilterForm>
): Partial<FilterForm> {
    return {
        usu_nom: form.usu_nom?.trim() ?? null,
        rol_id: form.rol_id ?? null,
    };
}