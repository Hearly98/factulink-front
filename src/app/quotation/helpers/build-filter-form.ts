import { FormControl } from '@angular/forms';
import { QuotationFilterForm } from '../core/types';

export const buildFilterForm = (): {
    [k in keyof QuotationFilterForm]: FormControl<any>;
} => {
    return {
        order: new FormControl('desc'),
        nombre: new FormControl(null),
        estados: new FormControl(['01']),
        fecha_desde: new FormControl(null),
        fecha_hasta: new FormControl(null),
        suc_id: new FormControl(null),
    };
};
