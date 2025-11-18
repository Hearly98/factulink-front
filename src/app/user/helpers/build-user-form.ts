import { FormControl } from '@angular/forms';
import { UserForm } from '../core/types';

export const buildUserForm = (): {
  [k in keyof UserForm]: FormControl<UserForm[k]>;
} => {
  return {
    usu_id: new FormControl(null),
    usu_nom: new FormControl(null),
    usu_ape: new FormControl(null),
    email: new FormControl(null),
    password: new FormControl(null),
    usu_dni: new FormControl(null),
    usu_telf: new FormControl(null),
    rol_id: new FormControl(null),
    est: new FormControl(true),
  };
};
