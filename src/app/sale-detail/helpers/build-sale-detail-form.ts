import { FormControl, FormGroup } from '@angular/forms';
import { SaleDetailForm } from '../core/types';

export const buildSaleDetailForm = (
  productData?: Partial<SaleDetailForm>
): FormGroup<{ [P in keyof SaleDetailForm]: FormControl<SaleDetailForm[P]> }> => {
  return new FormGroup({
    prod_id: new FormControl<number | null>(productData?.prod_id || null),
    prod_nom: new FormControl<string | null>(productData?.prod_nom || null),
    prod_cod_interno: new FormControl<string | null>(productData?.prod_cod_interno || null),
    cantidad: new FormControl<number | null>(productData?.cantidad || null),
    unidad: new FormControl<string | null>(productData?.unidad || null),
    costo_unitario: new FormControl<number | null>(productData?.costo_unitario || null),
    precio_unitario: new FormControl<number | null>(productData?.precio_unitario || 0),
    precio_venta: new FormControl<number | null>({
      value: productData?.precio_venta || 0,
      disabled: true,
    }),
    dscto: new FormControl<number | null>(productData?.dscto || null),
  });
};
