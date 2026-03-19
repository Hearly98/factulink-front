import { FormControl } from '@angular/forms';
import { FilterForm } from '../core/types';

export const buildFilterForm = (): {
    [K in keyof FilterForm]: FormControl<FilterForm[K] | any>;
} => {
    return {
        nombre: new FormControl(null),
        suc_id: new FormControl(null),
        activo: new FormControl(true),
        order: new FormControl('desc'),
    } as any;
};
