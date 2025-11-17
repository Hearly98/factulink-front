import { FilterForm } from '../core/types/filter-form';

export function mapParams(form: Partial<FilterForm>): Partial<FilterForm> {
  return {
    emp_nom: form.emp_nom?.trim() ?? null,
    order: form.order ?? null,
  };
}