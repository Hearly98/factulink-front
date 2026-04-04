import { MovimientoFilterForm } from '../core/types/movimiento-filter-form';

export const movementMapParams = (
  form: Partial<MovimientoFilterForm>,
): Partial<MovimientoFilterForm> => {
  return {
    almacen_id: form.almacen_id ?? null,
    fecha_desde: form.fecha_desde ?? null,
    fecha_hasta: form.fecha_hasta ?? null,
    tipo_movimiento: form.tipo_movimiento ?? null,
  };
};
