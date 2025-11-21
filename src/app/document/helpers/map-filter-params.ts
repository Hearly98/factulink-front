import { FilterForm } from '../core/types/filter-form';

export function mapParams(form: Partial<FilterForm>): Partial<FilterForm> {
  return {
    doc_nom: form.doc_nom?.trim() ?? null,
    est: form.est ?? null,
  };
}