import { RolForm } from '../core/types/rol-form';
import { FormControl, Validators } from '@angular/forms';

export const buildRolForm = (): {
  [K in keyof RolForm]: FormControl<RolForm[K]>;
} => {
  return {
    rol_id: new FormControl(null),
    rol_nom: new FormControl(
      null,
      Validators.compose([Validators.required, Validators.minLength(3)]),
    ),
    est: new FormControl(true),
  };
};
