import { FilterForm } from '../core/types/filter-form';
import { FormControl } from '@angular/forms';

export const buildFilterForm = (): {
  [K in keyof FilterForm]: FormControl<FilterForm[K]>;
} => {
  return {
    prod_nom: new FormControl(null),
    cat_id: new FormControl(null),
    suc_id: new FormControl(1),
    est: new FormControl(true),
    order: new FormControl('desc')
  };
};

