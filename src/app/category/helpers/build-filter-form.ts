import { FilterForm } from '../core/types/filter-form';
import { FormControl } from '@angular/forms';

export const buildFilterForm = (): {
  [K in keyof FilterForm]: FormControl<FilterForm[K]>;
} => {
  return {
    cat_nom: new FormControl(null),
    est: new FormControl(true),
    order: new FormControl('desc')
  };
};
