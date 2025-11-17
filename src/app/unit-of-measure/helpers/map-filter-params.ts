import { FilterForm } from '../core/types/filter-form';

export function mapParams(form: Partial<FilterForm>): Partial<FilterForm> {
  return {
    und_nom: form.und_nom?.trim() ?? null,
    order: form.order ?? null,
  };
}
