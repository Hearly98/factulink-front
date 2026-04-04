export interface PurchaseFilterForm {
  order: string | null;
  nombre: string | null;
  estados: number[] | null;
  fecha_desde: string | null;
  fecha_hasta: string | null;
}
