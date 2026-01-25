import { SaleFilterForm } from '../core/types';

export function mapParams(form: Partial<SaleFilterForm>): Partial<SaleFilterForm> {
  return {
    search: form.search?.trim() ?? null,
    estados: form.estados ?? [],
    fecha_inicio: form.fecha_inicio ?? null,
    fecha_fin: form.fecha_fin ?? null,
  };
}
