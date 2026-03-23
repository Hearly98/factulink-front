export interface ProductForm {
  prod_id: number | null;
  cat_id: number | null;
  und_id: number | null;
  mon_id: number | null;
  marca_id: number | null;
  prod_nom: string | null;
  prod_descrip: string | null;
  prod_cod_interno: string | null;
  cod_fabricante: string | null;
  prod_img: string | File | null;
  precio_compra_base: number | null;
  precio_venta_base: number | null;
  est: boolean | null;
}
