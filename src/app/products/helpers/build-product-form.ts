import { ProductForm } from '../core/types/product-form';
import { FormControl } from '@angular/forms';

export const buildProductForm = (): {
  [K in keyof ProductForm]: FormControl<ProductForm[K]>;
} => {
  return {
    prod_id: new FormControl(null),
    cat_id: new FormControl(null),
    prod_nom: new FormControl(null),
    prod_descrip: new FormControl(null),
    und_id: new FormControl(null),
    prod_img: new FormControl(null),
    est: new FormControl(true),
    cod_fabricante: new FormControl(null),
    prod_cod_interno: new FormControl(null),
  };
};
