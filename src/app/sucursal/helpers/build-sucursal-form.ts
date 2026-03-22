import { FormControl, Validators } from '@angular/forms';
import { SucursalForm } from '../core/types';

export const buildSucursalForm = (): {
  [K in keyof SucursalForm]: FormControl<SucursalForm[K]>;
} => {
  return {
    suc_id: new FormControl(null),
    emp_id: new FormControl(null),
    suc_cod: new FormControl(null),
    suc_nom: new FormControl(
      null,
      Validators.compose([Validators.required, Validators.minLength(3)]),
    ),
    ubigeo: new FormControl(null),
    direccion: new FormControl(null),
    departamento: new FormControl(null),
    provincia: new FormControl(null),
    distrito: new FormControl(null),
    est: new FormControl(true),
  };
};
