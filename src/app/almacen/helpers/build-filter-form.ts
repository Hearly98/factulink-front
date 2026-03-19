import { FormControl } from '@angular/forms';
import { FilterForm } from '../core/types';

export const buildFilterForm = (): {
    [K in keyof FilterForm]: FormControl<FilterForm[K] | any>;
} => {
    return {
        alm_nom: new FormControl(null),
        suc_id: new FormControl(null),
        est: new FormControl(true),
        order: new FormControl('desc'),
    } as any;
};
