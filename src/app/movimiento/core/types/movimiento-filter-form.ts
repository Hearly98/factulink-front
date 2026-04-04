export interface MovimientoFilterForm {
  tipo_movimiento: string | null;
  almacen_id: number | null;
  fecha_desde: string | null;
  fecha_hasta: string | null;
  search: string | null;
}
