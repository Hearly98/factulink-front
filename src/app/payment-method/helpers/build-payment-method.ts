import { FormControl } from '@angular/forms';
import { PaymentMethodForm } from '../core/types';

export const buildPaymentMethodForm = (): {
  [K in keyof PaymentMethodForm]: FormControl<PaymentMethodForm[K]>;
} => {
  return {
    mp_id: new FormControl(0),
    mp_nom: new FormControl(null),
    mp_cod: new FormControl(null),
    est: new FormControl(true),
  };
};
