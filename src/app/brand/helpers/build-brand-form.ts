import { BrandForm } from '../core/types/brand.form';
import { FormControl, Validators } from '@angular/forms';

export const buildBrandForm = (): {
  [K in keyof BrandForm]: FormControl<BrandForm[K]>;
} => {
  return {
    marca_id: new FormControl<number | null>(null),
    suc_id: new FormControl<number | null>(null, [Validators.required]),
    marca_codigo: new FormControl<string | null>(null, [Validators.required]),
    marca_nom: new FormControl<string | null>(null, [Validators.required]),
    est: new FormControl<boolean>(true),
  };
};
