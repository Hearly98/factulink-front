import { FormControl, Validators } from '@angular/forms';
import { SupplierForm } from '../core/types/supplier-form';

export const buildSupplierForm = (): {
  [K in keyof SupplierForm]: FormControl<SupplierForm[K]>;
} => {
  return {
    emp_id: new FormControl(1),
    est: new FormControl(true),
    prov_correo: new FormControl(null),
    prov_direcc: new FormControl(null),
    prov_id: new FormControl(null),
    prov_nom: new FormControl(null, Validators.required),
    tip_id: new FormControl(null),
    prov_documento: new FormControl(null),
    prov_telf: new FormControl(null),
  };
};
