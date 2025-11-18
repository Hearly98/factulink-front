import { FormControl } from '@angular/forms';
import { FilterForm } from '../core/types';

export const buildFilterForm = (): {
  [k in keyof FilterForm]: FormControl<FilterForm[k]>;
} => {
  return {
    order: new FormControl('desc'),
    rol_id: new FormControl(null),
    usu_nom: new FormControl(null),
  };
};
