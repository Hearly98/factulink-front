import { FormControl } from '@angular/forms';
import { FilterForm } from '../core/types';

export const buildFilterForm = (): {
  [K in keyof FilterForm]: FormControl<FilterForm[K]>;
} => {
  return {
    und_nom: new FormControl(null),
    order: new FormControl('desc'),
    suc_id: new FormControl(null),
  };
};
