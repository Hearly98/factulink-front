import { FormControl, Validators } from '@angular/forms';
import { CurrencyForm } from '../core/types/currency.form';

export const buildCurrencyForm = (): {
  [K in keyof CurrencyForm]: FormControl<CurrencyForm[K]>;
} => ({
  mon_id: new FormControl(null),
  mon_nom: new FormControl(
    null,
    Validators.compose([Validators.required, Validators.minLength(3)]),
  ),
  mon_cod: new FormControl(
    null,
    Validators.compose([Validators.required, Validators.minLength(2)]),
  ),
  mon_simbolo: new FormControl(
    null, Validators.compose([Validators.required])
  ),
  est: new FormControl(true),
});
