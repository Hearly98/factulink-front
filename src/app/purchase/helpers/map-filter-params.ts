import { PurchaseFilterForm } from '../core/types';

export function mapParams(form: Partial<PurchaseFilterForm>): Partial<PurchaseFilterForm> {
  const estados: string[] = [];
  
  if (form.estado_cancelado) estados.push('cancelado');
  if (form.estado_pendiente) estados.push('pendiente');
  if (form.estado_eliminado) estados.push('eliminado');

  return {
    search: form.search?.trim() ?? null,
    estados: estados.length > 0 ? estados.join(',') : null,
    fecha_inicio: form.fecha_inicio ?? null,
    fecha_fin: form.fecha_fin ?? null,
  };
}
