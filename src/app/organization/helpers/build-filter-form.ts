import { FormControl } from '@angular/forms';
import { FilterForm } from '../core/types/filter-form';

export const buildFilterForm = (): {
  [K in keyof FilterForm]: FormControl<FilterForm[K]>;
} => ({
  emp_nom: new FormControl(null),
  est: new FormControl(true),
  order: new FormControl('desc'),
});