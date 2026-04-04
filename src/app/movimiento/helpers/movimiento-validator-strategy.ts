import { AbstractControl, ValidatorFn } from '@angular/forms';

export type MovimientoTipo = 'TRANSFERENCIA' | 'INGRESO' | 'SALIDA';

export interface ValidatorStrategy {
  getValidators(tipo: MovimientoTipo): ValidatorFn[];
}

export class MovimientoValidatorStrategy implements ValidatorStrategy {
  getValidators(tipo: MovimientoTipo): ValidatorFn[] {
    const validators: { [key: string]: () => ValidatorFn[] } = {
      TRANSFERENCIA: () => [
        this.requiredValidator('almacen_origen_id'),
        this.requiredValidator('almacen_destino_id'),
      ],
      SALIDA: () => [
        this.requiredValidator('almacen_origen_id'),
      ],
      INGRESO: () => [
        this.requiredValidator('almacen_origen_id'),
      ],
    };

    return validators[tipo]?.() || [];
  }

  private requiredValidator(fieldName: string): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.value === null || control.value === undefined || control.value === '') {
        return { [fieldName]: { message: `El campo ${fieldName} es obligatorio.`, key: fieldName } };
      }
      return null;
    };
  }
}

export const movimientoValidatorStrategy = new MovimientoValidatorStrategy();
