export interface GetKardexModel {
    kar_id: number;
    kar_fec: string;
    kar_doc: string;
    kar_tip: 'INGRESO' | 'SALIDA' | 'TRANSFERENCIA' | 'AJUSTE';
    alm_id: number;
nombre: string;
    kar_cant: number;
    kar_sal: number;
    usu_id: number;
    usu_nom: string;
    prod_id: number;
    prod_nom: string;
}
