export class ProductoSucursalModel {
    prod_id: number = 0;
    suc_id: number = 0;
    prod_stock: number = 0;
    prod_pcompra_base: number = 0;
    prod_pventa_base: number = 0;
    est: boolean = true;
    prod_nom?: string;
    suc_nom?: string;
    sucursales_asignadas: string[] = [];
}
