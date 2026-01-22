export class ProductModel {
  suc_id: number = 0;
  cat_id: number = 0;
  prod_nom: string = '';
  prod_descrip: string = '';
  und_id: number = 0;
  prod_cod_interno: string = '';
  cod_fabricante: string = '';
  prod_img: string = '';
  sucursales?: number[] = [];
  est?: boolean = false;
}
