import { PurchaseFilterForm } from '../core/types';

export function mapParams(form: Partial<PurchaseFilterForm>): Partial<PurchaseFilterForm> {
  return {
    search: form.search?.trim() ?? null,
    estados: form.estados ?? [],
    fecha_inicio: form.fecha_inicio ?? null,
    fecha_fin: form.fecha_fin ?? null,
  };
}
