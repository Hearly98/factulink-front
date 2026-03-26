import { FormControl, FormGroup } from '@angular/forms';
import { MovimientoFilterForm } from '../core/types/movimiento-filter-form';

export const buildMovimientoFilterForm = (): {
  [K in keyof MovimientoFilterForm]: FormControl<MovimientoFilterForm[K]>;
} => ({
  mov_tip: new FormControl(null),
  alm_id: new FormControl(null),
  fec_ini: new FormControl(null),
  fec_fin: new FormControl(null),
});
