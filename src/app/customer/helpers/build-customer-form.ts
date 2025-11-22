import { FormControl } from '@angular/forms';
import { CustomerForm } from '../core/types/customer-form';

export const buildCustomerForm = (): {
  [K in keyof CustomerForm]: FormControl<CustomerForm[K]>;
} => {
  return {
    cli_id: new FormControl(null),
    cli_nom: new FormControl(null),
    tip_id: new FormControl(null),
    cli_documento: new FormControl(null),
    cli_telf: new FormControl(null),
    cli_direcc: new FormControl(null),
    cli_correo: new FormControl(null),
    est: new FormControl(true),
    emp_id: new FormControl(1),
  };
};
