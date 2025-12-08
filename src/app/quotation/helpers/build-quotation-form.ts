import { FormControl, Validators } from '@angular/forms';
import { QuotationForm } from '../core/types/quotation.form';

export function buildQuotationForm() {
  return {
    serie_id: new FormControl<number | null>(null, [Validators.required]),
    suc_id: new FormControl<number | null>(null, [Validators.required]),
    usu_id: new FormControl<number | null>(null, [Validators.required]),
    cli_id: new FormControl<number | null>(null, [Validators.required]),
    fechaEmision: new FormControl<Date | null>(new Date(), [Validators.required]),
    mon_id: new FormControl<number | null>(null, [Validators.required]),
    cli_documento: new FormControl<string | null>(null),
    cli_direcc: new FormControl<string | null>(null),
    cli_correo: new FormControl<string | null>(null),
    cli_telf: new FormControl<string | null>(null),
    tip_id: new FormControl<number | null>(null),
    cot_coment: new FormControl<string | null>(null),
    prod_id: new FormControl<number | null>(null),
    detalles: new FormControl<any[]>([]),
  };
}
