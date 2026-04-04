import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MovementType } from './movement-type.enum';

export interface MovimientoForm {
  doc_id: FormControl<number | null>;
  fechaEmision: FormControl<string | null>;
  tipoMovimiento: FormControl<MovementType | null>;
  almacen_origen_id: FormControl<number | null>;
  almacen_destino_id: FormControl<number | null>;
  motivo: FormControl<string | null>;
  referencia: FormControl<string | null>;
  detalle: FormArray<FormGroup<any>>;
}
