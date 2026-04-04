export interface GetAlmacenProductoModel {
    almacen_id: number;
    prod_id: number;
    prod_nom: string;
    prod_cod?: string;
    stock: number;
    est: boolean;
}
