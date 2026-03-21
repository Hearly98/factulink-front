import { FormControl, Validators } from '@angular/forms';
import { SucursalForm } from '../core/types';

export const buildSucursalForm = (): {
  [K in keyof SucursalForm]: FormControl<SucursalForm[K]>;
} => {
  return {
    suc_id: new FormControl(null, Validators.required),
    emp_id: new FormControl(null),
    suc_nom: new FormControl(null, Validators.required),
    est: new FormControl(true),
  };
};
