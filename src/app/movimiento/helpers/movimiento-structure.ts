export interface MovimientoField {
  label: string;
  formControlName: string;
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox';
  col: string;
  options?: { value: any; label: string }[];
  visibleWhen?: string;
}

export const movimientoStructure: MovimientoField[] = [
  {
    label: 'Tipo de Movimiento',
    formControlName: 'mov_tip',
    type: 'select',
    col: '12',
    options: [
      { value: 'TRANSFERENCIA', label: 'Transferencia' },
      { value: 'INGRESO', label: 'Ingreso' },
      { value: 'SALIDA', label: 'Salida' },
      { value: 'AJUSTE', label: 'Ajuste' },
    ],
  },
  {
    label: 'Fecha',
    formControlName: 'mov_fec',
    type: 'date',
    col: '6',
  },
  {
    label: 'Almacén Origen',
    formControlName: 'alm_id_ori',
    type: 'select',
    col: '6',
    visibleWhen: 'TRANSFERENCIA',
  },
  {
    label: 'Almacén Destino',
    formControlName: 'alm_id_des',
    type: 'select',
    col: '6',
  },
  {
    label: 'Motivo',
    formControlName: 'mov_mot',
    type: 'text',
    col: '12',
  },
  {
    label: 'Referencia',
    formControlName: 'mov_rec',
    type: 'text',
    col: '6',
  },
  {
    label: 'Guía de Remisión',
    formControlName: 'con_gui_rem',
    type: 'checkbox',
    col: '12',
  },
  {
    label: 'N° Guía',
    formControlName: 'gui_rem_num',
    type: 'text',
    col: '4',
  },
  {
    label: 'Fecha Guía',
    formControlName: 'gui_rem_fec',
    type: 'date',
    col: '4',
  },
  {
    label: 'Transportista',
    formControlName: 'gui_rem_tra',
    type: 'text',
    col: '4',
  },
];
