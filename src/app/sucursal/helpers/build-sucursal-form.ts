import { FormControl } from '@angular/forms';
import { SucursalForm } from '../core/types';

export const buildSucursalForm = (): {
  [K in keyof SucursalForm]: FormControl<SucursalForm[K]>;
} => {
  return {
    suc_id: new FormControl(null),
    emp_id: new FormControl(null),
    suc_nom: new FormControl(null),
    est: new FormControl(true),
  };
};
