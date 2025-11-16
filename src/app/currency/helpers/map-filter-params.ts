import { FilterForm } from '../core/types/filter-form';

export function mapParams(form: Partial<FilterForm>): Partial<FilterForm> {
  return {
    mon_nom: form.mon_nom?.trim() ?? null,
    est: form.est ?? null,
    suc_id: form.suc_id ?? null,
  };
}