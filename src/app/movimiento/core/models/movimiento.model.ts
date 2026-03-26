export interface MovimientoDetailModel {
    prod_id: number;
    prod_nom?: string;
    prod_cod_interno?: string;
    cant: number;
}

export interface MovimientoModel {
    mov_id?: number;
    mov_fec?: string;
    mov_fecha?: string;
    mov_tip: 'TRANSFERENCIA' | 'INGRESO' | 'SALIDA' | 'AJUSTE';
    alm_id_ori?: number | null;
    alm_id_des?: number | null;
    mov_mot: string;
    mov_rec?: string;

    // Guía de remisión
    con_gui_rem: boolean;
    gui_rem_num?: string;
    gui_rem_fec?: string;
    gui_rem_tra?: string; // Transportista / Motivo traslado

    details?: MovimientoDetailModel[];
}

export interface GetMovimientoModel extends MovimientoModel {
    mov_id: number;
    mov_fecha?: string;
    alm_ori_nom?: string;
    alm_des_nom?: string;
    alm_nom?: string;
    prod_nom?: string;
    prod_id?: number;
    mov_cantidad?: number;
    mov_referencia?: string;
    usu_nom?: string;
    est?: boolean;
}
