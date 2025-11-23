import { FormControl } from '@angular/forms';
import { PurchaseForm } from '../core/purchase.form';

export const buildPurchaseForm = (): {
  [K in keyof PurchaseForm]: FormControl<PurchaseForm[K]>;
} => {
  return {
    doc_id: new FormControl<number | null>(null),
    mon_id: new FormControl<number | null>(null),
    pago_id: new FormControl<number | null>(null),
    prov_id: new FormControl<number | null>(null),
    prov_documento: new FormControl<number | null>({ value: null, disabled: true }),
    tip_id: new FormControl<number | null>({ value: null, disabled: true }),
    prov_direcc: new FormControl<string | null>({ value: null, disabled: true }),
    prov_correo: new FormControl<string | null>({ value: null, disabled: true }),
    prov_telf: new FormControl<string | null>({ value: null, disabled: true }),
    product_id: new FormControl<number | null>(null),
  };
};
