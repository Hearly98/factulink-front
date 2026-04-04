export enum MovementType {
  INGRESO = 'INGRESO',
  SALIDA = 'SALIDA',
  TRANSFERENCIA = 'TRANSFERENCIA',
}

export type MovimientoTipo = keyof typeof MovementType;