import { FilterForm } from '../core/types/filter-form';

export function mapParams(form: Partial<FilterForm>): Partial<FilterForm> {
  return {
    tip_nom: form.tip_nom?.trim() ?? null,
    order: form.order ?? null,
  };
}
