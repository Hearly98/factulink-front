import { PurchaseFilterForm } from '../core/types';

export function mapParams(form: Partial<PurchaseFilterForm>): Partial<PurchaseFilterForm> {
  return {
    nombre: form.nombre?.trim() ?? null,
    estados: form.estados ?? [],
    fecha_desde: form.fecha_desde ?? null,
    fecha_hasta: form.fecha_hasta ?? null,
  };
}
