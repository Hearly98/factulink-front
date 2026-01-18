import { FormControl, Validators } from '@angular/forms';
import { QuotationDetailForm } from '../core/types/quotation-detail.form';

export function buildQuotationDetailForm(data?: Partial<QuotationDetailForm>) {
  return {
    prod_id: new FormControl<number>(data?.prod_id || 0, [Validators.required]),
    cantidad: new FormControl<number>(data?.cantidad || 1, [Validators.required, Validators.min(1)]),
    prod_nom: new FormControl<string>(data?.prod_nom || '', [Validators.required]),
    prod_cod: new FormControl<string>(data?.prod_cod || '', [Validators.required]),
    unidad: new FormControl<string>(data?.unidad || ''),
    precio_unitario: new FormControl<number>(data?.precio_unitario || 0, [Validators.required, Validators.min(0)]),
    dscto: new FormControl<number | null>(data?.dscto || 0),
    precio_total: new FormControl<number | null>(data?.precio_total || null),
  };
}
