import { ProductForm } from "../core/types/product-form";
import { FormControl } from "@angular/forms";

export const buildProductForm = (): {
    [K in keyof ProductForm]: FormControl<ProductForm[K]>
} =>
{
  return {
    prod_id: new FormControl(null),
    suc_id: new FormControl(null),
    cat_id: new FormControl(null),
    prod_nom: new FormControl(null),
    prod_descrip: new FormControl(null),
    und_id: new FormControl(null),
    mon_id: new FormControl(null),
    prod_pcompra: new FormControl(null),
    prod_pventa: new FormControl(null),
    prod_stock: new FormControl(null),
    prod_fechaven: new FormControl(null),
    prod_img: new FormControl(null),
    est: new FormControl(true)
  };
}

