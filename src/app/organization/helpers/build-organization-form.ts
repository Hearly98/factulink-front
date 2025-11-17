import { FormControl, Validators } from '@angular/forms';
import { OrganizationForm } from '../core/types/organization.form';

export const buildOrganizationForm = (): {
  [K in keyof OrganizationForm]: FormControl<OrganizationForm[K]>;
} => ({
  emp_id: new FormControl(null),
  emp_nom: new FormControl(null, Validators.required),
  emp_ruc: new FormControl(null, Validators.required),
  emp_correo: new FormControl(null),
  emp_direcc: new FormControl(null, Validators.required),
  emp_telf: new FormControl(null),
  emp_pag: new FormControl(null),
  emp_logo: new FormControl(null),
  com_id: new FormControl(1),
  est: new FormControl(true),
});