import { FormControl, Validators } from '@angular/forms';
import { PaymentMethodForm } from '../core/types';

export const buildPaymentMethodForm = (): {
  [K in keyof PaymentMethodForm]: FormControl<PaymentMethodForm[K]>;
} => {
  return {
    mp_id: new FormControl(0),
    mp_nom: new FormControl(
      null,
      Validators.compose([Validators.required, Validators.minLength(3)]),
    ),
    mp_cod: new FormControl(
      null,
      Validators.compose([Validators.required, Validators.minLength(2)]),
    ),
    est: new FormControl(true),
  };
};
