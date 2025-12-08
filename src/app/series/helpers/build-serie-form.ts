import { FormControl, Validators } from '@angular/forms';

export function buildSerieForm() {
  return {
    doc_cod: new FormControl<string | null>(null, [Validators.required]),
    ser_num: new FormControl<string | null>(null, [Validators.required]),
    ser_corr: new FormControl<number | null>(1, [Validators.required, Validators.min(1)]),
    est: new FormControl<boolean | null>(true),
  };
}
