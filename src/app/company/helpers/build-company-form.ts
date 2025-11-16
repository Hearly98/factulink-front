import { FormControl } from '@angular/forms';
import { CompanyForm } from '../core/types/company.form';

export const buildCompanyForm = (): {
  [K in keyof CompanyForm]: FormControl<CompanyForm[K]>;
} => ({
  com_nom: new FormControl(null),
  est: new FormControl(true),
});