import { FormControl } from '@angular/forms';
import { CurrencyForm } from '../core/types/currency.form';

export const buildCurrencyForm = (): {
  [K in keyof CurrencyForm]: FormControl<CurrencyForm[K]>;
} => ({
  mon_id: new FormControl(null),
  mon_nom: new FormControl(null),
  mon_cod: new FormControl(null),
  est: new FormControl(true),
});
