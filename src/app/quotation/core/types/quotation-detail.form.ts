export interface QuotationDetailForm {
    prod_id: number;
    cantidad: number;
    prod_nom: string;
    prod_cod: string;
    unidad: string;
    precio_unitario: number;
    dscto: number | null;
    precio_total: number | null;
}
