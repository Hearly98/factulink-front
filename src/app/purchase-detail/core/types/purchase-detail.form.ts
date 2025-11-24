export interface PurchaseDetailForm {
  prod_id: number | null;
  prod_nom: string | null;
  cat_id: number | null;
  cat_nom: string | null;
  unid_med: string | null;
  cantidad: number | null;
  precio: number | null;
  stock: number | null;
  subtotal: number | null;
}