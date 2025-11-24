import { FormControl, FormGroup } from '@angular/forms';
import { PurchaseDetailForm } from '../core/types';

export const buildPurchaseDetailForm = (
  productData?: Partial<PurchaseDetailForm>
): FormGroup<{ [P in keyof PurchaseDetailForm]: FormControl<PurchaseDetailForm[P]> }> => {
  return new FormGroup({
    prod_id: new FormControl<number | null>(productData?.prod_id || null),
    prod_nom: new FormControl<string | null>({
      value: productData?.prod_nom || null,
      disabled: true,
    }),
    cat_id: new FormControl<number | null>(productData?.cat_id || null),
    cat_nom: new FormControl<string | null>({
      value: productData?.cat_nom || null,
      disabled: true,
    }),
    unid_med: new FormControl<string | null>(productData?.unid_med || 'UND'),
    cantidad: new FormControl<number | null>(productData?.cantidad || 1),
    precio: new FormControl<number | null>(productData?.precio || 0),
    stock: new FormControl<number | null>({
      value: productData?.stock || 0,
      disabled: true,
    }),
    subtotal: new FormControl<number | null>({
      value: productData?.subtotal || 0,
      disabled: true,
    }),
  });
};
