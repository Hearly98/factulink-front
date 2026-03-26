export class ProductModel {
  suc_id: number = 0;
  cat_id: number = 0;
  prod_nom: string = '';
  prod_descrip: string = '';
  und_id: number = 0;
  prod_cod_interno: string = '';
  cod_fabricante: string = '';
  prod_img: string = '';
  mon_id: number = 0;
  marca_id: number = 0;
  precio_compra_base: number = 0;
  precio_venta_base: number = 0;
  sucursales?: number[] = [];
  est?: boolean = false;
}
