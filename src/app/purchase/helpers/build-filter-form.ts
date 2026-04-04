import { FormControl } from '@angular/forms';
import { PurchaseFilterForm } from '../core/types';

export const buildFilterForm = (): {
  [k in keyof PurchaseFilterForm]: FormControl<PurchaseFilterForm[k]>;
} => {
  return {
    order: new FormControl('desc'),
    nombre: new FormControl(null),
    estados: new FormControl([2, 1]),
    fecha_desde: new FormControl(null),
    fecha_hasta: new FormControl(null),
  };
};
