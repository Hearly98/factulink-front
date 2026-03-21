import { FormControl, Validators } from '@angular/forms';
import { SupplierForm } from '../core/types/supplier-form';

export const buildSupplierForm = (): {
  [K in keyof SupplierForm]: FormControl<SupplierForm[K]>;
} => {
  return {
    emp_id: new FormControl(1),
    est: new FormControl(true),
     prov_nom: new FormControl(
      null,
      Validators.compose([Validators.required, Validators.minLength(3)]),
    ),
    prov_correo: new FormControl(null, Validators.compose([Validators.required, Validators.email])),
    prov_direcc: new FormControl(
      null,
      Validators.compose([Validators.required, Validators.minLength(3)]),
    ),
    prov_id: new FormControl(null),
    tip_id: new FormControl(null, Validators.required),
    prov_documento: new FormControl(null, Validators.required),
    prov_telf: new FormControl(
      null,
    ),
  };
};
