import { FormControl } from '@angular/forms';

export interface SerieForm {
  doc_cod: FormControl<string | null>;
  ser_num: FormControl<string | null>;
  ser_corr: FormControl<number | null>;
  est: FormControl<boolean | null>;
}
