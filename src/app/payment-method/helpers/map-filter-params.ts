import { FilterForm } from '../core/types/filter-form';

export function mapParams(form: Partial<FilterForm>): Partial<FilterForm> {
  return {
    mp_nom: form.mp_nom?.trim() ?? null,
    order: form.order ?? null,
  };
}
