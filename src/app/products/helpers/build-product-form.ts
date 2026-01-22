import { ProductForm } from '../core/types/product-form';
import { FormControl } from '@angular/forms';

export const buildProductForm = (): {
  [K in keyof ProductForm]: FormControl<ProductForm[K]>;
} => {
  return {
    prod_id: new FormControl<number | null>(null),
    cat_id: new FormControl<number | null>(null),
    prod_nom: new FormControl<string | null>(null),
    prod_descrip: new FormControl<string | null>(null),
    und_id: new FormControl<number | null>(null),
    prod_img: new FormControl<string | null>(null),
    est: new FormControl<boolean>(true),
    cod_fabricante: new FormControl<string | null>(null),
    prod_cod_interno: new FormControl<string | null>(null),
    sucursales: new FormControl<number[]>([]),
  };
};
