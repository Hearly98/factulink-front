import { QuotationFilterForm } from '../core/types';

export function mapParams(form: Partial<QuotationFilterForm>): Partial<QuotationFilterForm> {
    return {
        nombre: form.nombre?.trim() ?? null,
        estados: form.estados ?? [],
        fecha_desde: form.fecha_desde ?? null,
        fecha_hasta: form.fecha_hasta ?? null,
        suc_id: form.suc_id ?? null,
    };
}
