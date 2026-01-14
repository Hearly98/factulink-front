export interface PurchaseDetailForm {
  prod_id: number | null;
  prod_nom: string | null;
  prod_cod_interno: string | null;
  cantidad: number | null;
  unidad: string | null;
  costo_unitario: number | null;
  precio_unitario: number | null;
  precio_compra: number | null;
  dscto: number | null;
}
