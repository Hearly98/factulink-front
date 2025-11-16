import { FilterForm } from '../core/types/filter-form';

export function mapParams(form: Partial<FilterForm>): Partial<FilterForm> {
  return {
    doc_nom: form.doc_nom?.trim() ?? null,
    doc_tipo: form.doc_tipo?.trim() ?? null,
    est: form.est ?? null,
  };
}