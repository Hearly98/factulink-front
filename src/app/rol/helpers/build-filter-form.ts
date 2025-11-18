import { FilterForm } from '../core/types/filter-form';
import { FormControl } from '@angular/forms';

export const buildFilterForm = (): {
  [K in keyof FilterForm]: FormControl<FilterForm[K]>;
} => {
  return {
    rol_nom: new FormControl(null),
    suc_id: new FormControl(null),
    order: new FormControl('desc'),
  };
};
