import { FormControl, Validators } from '@angular/forms';
import { CompanyForm } from '../core/types/company.form';

export const buildCompanyForm = (): {
  [K in keyof CompanyForm]: FormControl<CompanyForm[K]>;
} => ({
  com_id: new FormControl(null),
  com_nom: new FormControl(null, Validators.required),
  com_direcc: new FormControl(null),
  com_duenio: new FormControl(null),
  com_telf: new FormControl(null),
  com_email: new FormControl(null),
  est: new FormControl(true),
});
