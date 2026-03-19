import { FormControl, Validators } from '@angular/forms';
import { AlmacenForm } from '../core/types';

export const buildAlmacenForm = (): {
    [K in keyof AlmacenForm]: FormControl<AlmacenForm[K] | any>;
} => {
    return {
        alm_id: new FormControl(null),
        nombre: new FormControl(null, [Validators.required]),
        suc_id: new FormControl(null, [Validators.required]),
        descripcion: new FormControl(null),
        activo: new FormControl(true),
    };
};
