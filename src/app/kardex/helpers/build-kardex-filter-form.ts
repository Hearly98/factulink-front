import { FormControl, Validators } from '@angular/forms';
import { KardexFilterForm } from '../core/types/kardex-filter.form';

export const buildKardexFilterForm = (): {
    [K in keyof KardexFilterForm]: FormControl<KardexFilterForm[K] | any>;
} => {
    return {
        prod_id: new FormControl(null, [Validators.required]),
        alm_id: new FormControl(null),
        fec_ini: new FormControl(null),
        fec_fin: new FormControl(null),
        kar_tip: new FormControl(null),
        kar_doc: new FormControl(null),
        usu_id: new FormControl(null),
        order: new FormControl('desc'),
        pageSize: new FormControl(50),
    };
};
