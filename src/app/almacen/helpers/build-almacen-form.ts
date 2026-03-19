import { FormControl, Validators } from '@angular/forms';
import { AlmacenForm } from '../core/types';

export const buildAlmacenForm = (): {
    [K in keyof AlmacenForm]: FormControl<AlmacenForm[K] | any>;
} => {
    return {
        alm_id: new FormControl(null),
        alm_nom: new FormControl(null, [Validators.required]),
        suc_id: new FormControl(null, [Validators.required]),
        est: new FormControl(true),
    };
};
