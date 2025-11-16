import { FormControl } from '@angular/forms';
import { OrganizationForm } from '../core/types/organization.form';

export const buildOrganizationForm = (): {
  [K in keyof OrganizationForm]: FormControl<OrganizationForm[K]>;
} => ({
  emp_nom: new FormControl(null),
  emp_ruc: new FormControl(null),
  emp_correo: new FormControl(null),
  emp_direcc: new FormControl(null),
  emp_telf: new FormControl(null),
  emp_pag: new FormControl(null),
  emp_logo: new FormControl(null),
  est: new FormControl(true),
});