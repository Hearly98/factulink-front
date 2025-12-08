import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { PurchaseForm } from '../core/purchase.form';
import { PurchaseDetailForm } from 'src/app/purchase-detail/core/types';

export const buildPurchaseForm = (): {
  [K in keyof PurchaseForm]: K extends 'detalles'
  ? FormArray<FormGroup<{ [P in keyof PurchaseDetailForm]: FormControl<PurchaseDetailForm[P]> }>>
  : FormControl<PurchaseForm[K]>;
} => {
  return {
    mon_id: new FormControl<number | null>(null),
    usu_id: new FormControl<number | null>(null),
    prov_documento: new FormControl<string | null>(null),
    prod_id: new FormControl<number | null>(null),
    prov_direcc: new FormControl<string | null>(null),
    prov_correo: new FormControl<string | null>(null),
    prov_telf: new FormControl<string | null>(null),
    tip_id: new FormControl<number | null>(null),
    fechaEmision: new FormControl<Date | null>(null),
    numero: new FormControl<string | null>(null),
    compr_coment: new FormControl<string | null>(null),
    prov_id: new FormControl<number | null>(null),
    mp_id: new FormControl<number | null>(null),
    suc_id: new FormControl<number | null>(null),
    doc_id: new FormControl<number | null>(null),
    detalles: new FormArray<
      FormGroup<{ [P in keyof PurchaseDetailForm]: FormControl<PurchaseDetailForm[P]> }>
    >([]),
  };
};
