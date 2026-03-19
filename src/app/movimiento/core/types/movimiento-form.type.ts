export interface MovimientoForm {
    mov_id: number | null;
    mov_fec: string;
    mov_tip: string;
    alm_id_ori: number | null;
    alm_id_des: number | null;
    mov_mot: string;
    mov_rec: string;
    con_gui_rem: boolean;
    gui_rem_num: string;
    gui_rem_fec: string;
    gui_rem_tra: string;
}

export interface MovimientoDetailForm {
    prod_id: number | null;
    prod_nom: string;
    cant: number;
}
