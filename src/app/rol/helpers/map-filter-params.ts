import { FilterForm } from '../core/types/filter-form';

export function mapParams(form: Partial<FilterForm>): Partial<FilterForm> {
  return {
    rol_nom: form.rol_nom?.trim() ?? null,
    order: form.order ?? "desc",
  };
}
