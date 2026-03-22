import { FormControl, Validators } from '@angular/forms';
import { AlmacenForm } from '../core/types';

export const buildAlmacenForm = (): {
  [K in keyof AlmacenForm]: FormControl<AlmacenForm[K] | any>;
} => {
  return {
    almacen_id: new FormControl(null),
    codigo: new FormControl(
      null,
      Validators.compose([Validators.required, Validators.minLength(2)]),
    ),
    nombre: new FormControl(
      null,
      Validators.compose([Validators.required, Validators.minLength(3)]),
    ),
    suc_id: new FormControl(null, Validators.required),
    descripcion: new FormControl(null),
    activo: new FormControl(true),
  };
};
