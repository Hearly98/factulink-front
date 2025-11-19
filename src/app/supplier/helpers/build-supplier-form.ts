import { FormControl } from '@angular/forms';
import { SupplierForm } from '../core/types/supplier-form';

export const buildSupplierForm = (): {
  [K in keyof SupplierForm]: FormControl<SupplierForm[K]>;
} => {
  return {
    emp: new FormControl(null),
    est: new FormControl(true),
    prov_correo: new FormControl(null),
    prov_direcc: new FormControl(null),
    prov_id: new FormControl(null),
    prov_nom: new FormControl(null),
    prov_ruc: new FormControl(null),
    prov_telf: new FormControl(null),
  };
};
