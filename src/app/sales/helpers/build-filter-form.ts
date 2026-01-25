import { FormControl } from '@angular/forms';
import { SaleFilterForm } from '../core/types';

export const buildFilterForm = (): {
  [k in keyof SaleFilterForm]: FormControl<SaleFilterForm[k]>;
} => {
  return {
    order: new FormControl('desc'),
    search: new FormControl(null),
    estados: new FormControl([2, 1]),
    fecha_inicio: new FormControl(null),
    fecha_fin: new FormControl(null),
  };
};
