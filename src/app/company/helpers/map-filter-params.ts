import { FilterForm } from '../core/types/filter-form';

export function mapParams(form: Partial<FilterForm>): Partial<FilterForm> {
  return {
    com_nom: form.com_nom?.trim() ?? null,
    est: form.est ?? null,
  };
}