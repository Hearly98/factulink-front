import { FormControl, Validators } from '@angular/forms';
import { CustomerForm } from '../core/types/customer-form';

export const buildCustomerForm = (): {
  [K in keyof CustomerForm]: FormControl<CustomerForm[K]>;
} => {
  return {
    cli_id: new FormControl(null),
    cli_nom: new FormControl(
      null,
      Validators.compose([Validators.required, Validators.minLength(3)]),
    ),
    tip_id: new FormControl(null, Validators.required),
    cli_documento: new FormControl(null, Validators.required),
    cli_telf: new FormControl(null, Validators.required),
    cli_direcc: new FormControl(null),
    cli_correo: new FormControl(null, Validators.compose([Validators.required, Validators.email])),
    est: new FormControl(true),
    emp_id: new FormControl(1),
  };
};
