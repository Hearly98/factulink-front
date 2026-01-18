export interface QuotationFilterForm {
    order: 'asc' | 'desc';
    nombre: string | null;
    estados: string[];
    fecha_desde: string | null;
    fecha_hasta: string | null;
    suc_id: number | null;
}
