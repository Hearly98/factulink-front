import { FormControl, Validators } from '@angular/forms';
import { UserForm } from '../core/types';

export const buildUserForm = (): {
  [k in keyof UserForm]: FormControl<UserForm[k]>;
} => {
  return {
    usu_id: new FormControl(null),
    usu_nom: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    usu_ape: new FormControl(null, [Validators.required, Validators.minLength(3)]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, Validators.required),
    usu_dni: new FormControl(null, [Validators.required]),
    usu_telf: new FormControl(null, [Validators.required]),
    rol_id: new FormControl(null),
    usu_img: new FormControl(null),
    est: new FormControl(true),
  };
};
