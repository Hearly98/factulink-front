import { FormControl, FormArray, FormGroup, Validators } from '@angular/forms';
import { MovementType } from '../core/types/movement-type.enum';
import { MovimientoDetailForm } from '../core/types/movement-detail-form';
import { MovimientoForm } from '../core/types/movimiento-form';
export const buildMovimientoForm = () => {
  return new FormGroup<MovimientoForm>({
    doc_id: new FormControl<number | null>(null),
    fechaEmision: new FormControl<string | null>({
      value: new Date().toISOString().split('T')[0],
      disabled: true,
    }),
    tipoMovimiento: new FormControl<MovementType | null>(null, Validators.required),
    almacen_origen_id: new FormControl<number | null>(null),
    almacen_destino_id: new FormControl<number | null>(null),
    motivo: new FormControl<string | null>(null),
    referencia: new FormControl<string | null>(null),
    detalle: new FormArray<FormGroup<any>>([]),
  });
};

export const buildMovimientoDetailForm = () =>
  new FormGroup<{
    [K in keyof MovimientoDetailForm]: FormControl<MovimientoDetailForm[K]>;
  }>({
    idProducto: new FormControl<number | null>(null, Validators.required),
    cantidad: new FormControl<number | null>(null, [Validators.required, Validators.min(0.0001)]),
    nombreProducto: new FormControl<string | null>(null),
    codigoProducto: new FormControl<string | null>(null),
    costoUnitario: new FormControl<number | null>(null),
  });
