import { AbstractControl, ValidatorFn } from '@angular/forms';

export type MovimientoTipo = 'TRANSFERENCIA' | 'INGRESO' | 'SALIDA' | 'AJUSTE';

export interface ValidatorStrategy {
  getValidators(tipo: MovimientoTipo): ValidatorFn[];
}

export class MovimientoValidatorStrategy implements ValidatorStrategy {
  getValidators(tipo: MovimientoTipo): ValidatorFn[] {
    const validators: { [key: string]: () => ValidatorFn[] } = {
      TRANSFERENCIA: () => [
        this.requiredValidator('alm_id_ori'),
        this.requiredValidator('alm_id_des'),
      ],
      SALIDA: () => [
        this.requiredValidator('alm_id_ori'),
      ],
      INGRESO: () => [
        this.requiredValidator('alm_id_des'),
      ],
      AJUSTE: () => [
        this.requiredValidator('alm_id_des'),
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
