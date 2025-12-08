export interface PurchaseFilterForm {
  order: string | null;
  search: string | null;
  estado_cancelado: boolean | null;
  estado_pendiente: boolean | null;
  estado_eliminado: boolean | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  estados?: string | null;
}
