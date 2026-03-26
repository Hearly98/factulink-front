export interface MovimientoDetailForm {
  prod_id: number;
  prod_nom?: string;
  prod_cod_interno?: string;
  cant: number;
}

export interface MovimientoForm {
  mov_id: number | null;
  mov_fec: string;
  mov_tip: 'TRANSFERENCIA' | 'INGRESO' | 'SALIDA' | 'AJUSTE' | null;
  alm_id_ori: number | null;
  alm_id_des: number | null;
  mov_mot: string;
  mov_rec: string;
  con_gui_rem: boolean;
  gui_rem_num: string;
  gui_rem_fec: string | null;
  gui_rem_tra: string;
  details: MovimientoDetailForm[];
  temp_prod_id: number | null;
  temp_cant: number;
}
