export interface GetAlmacenProductoModel {
    alm_prod_id: number;
    alm_id: number;
    prod_id: number;
    prod_nom: string;
    prod_cod?: string;
    stock: number;
    est: boolean;
}
