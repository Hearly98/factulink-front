import { FilterForm } from '../core/types/filter-form';
import { FormControl } from '@angular/forms';

export const buildFilterForm = (): {
  [K in keyof FilterForm]: FormControl<FilterForm[K]>;
} => {
  return {
    marca_nom: new FormControl<string | null>(null),
    marca_codigo: new FormControl<string | null>(null),
    suc_id: new FormControl<number | null>(null),
    est: new FormControl<boolean | null>(true),
    order: new FormControl<string>('desc'),
  };
};
