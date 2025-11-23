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
    prov_ruc: new FormControl<number | null>(null),
    prov_direcc: new FormControl<string | null>(null),
    prov_correo: new FormControl<string | null>(null),
    prov_telf: new FormControl<string | null>(null),
    product_id: new FormControl<number | null>(null),
  };
};
