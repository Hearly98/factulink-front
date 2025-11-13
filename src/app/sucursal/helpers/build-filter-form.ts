import { FormControl } from '@angular/forms';
import { FilterForm } from '../core/types';

export const buildFilterForm = (): {
  [K in keyof FilterForm]: FormControl<FilterForm[K]>;
} => {
  return {
    suc_nom: new FormControl(null),
    est: new FormControl(true),
    emp_id: new FormControl(1),
    order: new FormControl('desc'),
  };
};
