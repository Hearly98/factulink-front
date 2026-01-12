import { FormControl, Validators } from '@angular/forms';
import { ProductoSucursalForm } from '../core/types';

export const buildProductoSucursalForm = (): {
    [K in keyof ProductoSucursalForm]: FormControl<ProductoSucursalForm[K] | any>;
} => {
    return {
        prodsuc_id: new FormControl(null),
        prod_id: new FormControl(null, [Validators.required]),
        suc_id: new FormControl(null, [Validators.required]),
        prod_stock: new FormControl(0),
        prod_pcompra_base: new FormControl(0),
        prod_pventa_base: new FormControl(0),
        est: new FormControl(true),
    };
};
