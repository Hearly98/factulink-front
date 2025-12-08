import { FormControl, Validators } from '@angular/forms';
import { PurchaseEditForm } from '../core/types/purchase-edit.form';

export const buildPurchaseEditForm = (): {
  [k in keyof PurchaseEditForm]: FormControl<PurchaseEditForm[k]>;
} => {
  return {
    com_id: new FormControl(null),
    com_fecha: new FormControl(null, [Validators.required]),
    com_total: new FormControl(null, [Validators.required]),
    com_estado: new FormControl(null, [Validators.required]),
    prv_id: new FormControl(null, [Validators.required]),
    suc_id: new FormControl(null, [Validators.required]),
    com_observaciones: new FormControl(null),
  };
};
