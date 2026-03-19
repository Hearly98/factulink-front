export interface KardexFilterForm {
    prod_id: number | null;
    alm_id: number | null;
    fec_ini: string | null;
    fec_fin: string | null;
    kar_tip: string | null;
    kar_doc: string | null;
    usu_id: number | null;
    order: 'asc' | 'desc';
    pageSize: number;
}
