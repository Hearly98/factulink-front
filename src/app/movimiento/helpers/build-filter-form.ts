import { FormControl } from '@angular/forms';
import { MovimientoFilterForm } from '../core/types/movimiento-filter-form';

export const buildMovimientoFilterForm = (): {
  [K in keyof MovimientoFilterForm]: FormControl<MovimientoFilterForm[K]>;
} => ({
  tipo_movimiento: new FormControl(null),
  almacen_id: new FormControl(null),
  fecha_desde: new FormControl(null),
  fecha_hasta: new FormControl(null),
  search: new FormControl(null),
});
