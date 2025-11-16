import { FormControl } from '@angular/forms';
import { FilterForm } from '../core/types/filter-form';

export const buildFilterForm = (): {
  [K in keyof FilterForm]: FormControl<FilterForm[K]>;
} => ({
  mon_nom: new FormControl(null),
  est: new FormControl(true),
  suc_id: new FormControl(1),
  order: new FormControl('desc'),
});