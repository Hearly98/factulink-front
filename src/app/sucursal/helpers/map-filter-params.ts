import { FilterForm } from '../core/types';

export function mapParams(form: Partial<FilterForm>): Partial<FilterForm> {
  return {
    suc_nom: form.suc_nom?.trim() ?? null,
    est: form.est ?? null,
  };
}
