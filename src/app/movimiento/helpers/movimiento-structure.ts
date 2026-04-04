import { MovimientoTipo } from './movimiento-validator-strategy';

export interface MovimientoField {
  label: string;
  formControlName: string;
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox';
  col: string;
  options?: { value: any; label: string }[];
  visibleWhen?: MovimientoTipo[];
  getLabel?: (tipo: MovimientoTipo) => string;
}

export const movimientoStructure: MovimientoField[] = [
  {
    label: 'Fecha',
    formControlName: 'fechaEmision',
    type: 'date',
    col: '3',
  },
  {
    label: 'Tipo de Movimiento',
    formControlName: 'tipoMovimiento',
    type: 'select',
    col: '3',
    options: [
      { value: 'TRANSFERENCIA', label: 'Transferencia' },
      { value: 'INGRESO', label: 'Ingreso' },
      { value: 'SALIDA', label: 'Salida' },
    ],
  },
  {
    label: 'Almacén',
    formControlName: 'almacen_origen_id',
    type: 'select',
    col: '3',
    visibleWhen: ['TRANSFERENCIA', 'SALIDA', 'INGRESO'],
    getLabel: (tipo: MovimientoTipo) => {
      switch (tipo) {
        case 'TRANSFERENCIA':
          return 'Almacén Origen';
        case 'SALIDA':
          return 'Almacén';
        case 'INGRESO':
          return 'Almacén';
        default:
          return 'Almacén';
      }
    },
  },
  {
    label: 'Almacén Destino',
    formControlName: 'almacen_destino_id',
    type: 'select',
    col: '3',
    visibleWhen: ['TRANSFERENCIA'],
    getLabel: (tipo: MovimientoTipo) => {
      switch (tipo) {
        case 'TRANSFERENCIA':
          return 'Almacén Destino';
        default:
          return 'Almacén Destino';
      }
    },
  },
  {
    label: 'Motivo',
    formControlName: 'motivo',
    type: 'text',
    col: '4',
  },
  {
    label: 'Referencia',
    formControlName: 'referencia',
    type: 'text',
    col: '4',
  },
];
