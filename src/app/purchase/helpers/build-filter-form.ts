import { FormControl } from '@angular/forms';
import { PurchaseFilterForm } from '../core/types';

export const buildFilterForm = (): {
  [k in keyof PurchaseFilterForm]: FormControl<PurchaseFilterForm[k]>;
} => {
  return {
    order: new FormControl('desc'),
    search: new FormControl(null),
    estado_cancelado: new FormControl(false),
    estado_pendiente: new FormControl(false),
    estado_eliminado: new FormControl(false),
    fecha_inicio: new FormControl(null),
    fecha_fin: new FormControl(null),
  };
};
