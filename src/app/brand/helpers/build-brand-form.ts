import { BrandForm } from '../core/types/brand.form';
import { FormControl, Validators } from '@angular/forms';

export const buildBrandForm = (): {
  [K in keyof BrandForm]: FormControl<BrandForm[K]>;
} => {
  return {
    marca_id: new FormControl<number | null>(null),
    marca_codigo: new FormControl<string | null>(
      null,
      Validators.compose([Validators.required, Validators.minLength(2)]),
    ),
    marca_nom: new FormControl<string | null>(
      null,
      Validators.compose([Validators.required, Validators.minLength(3)]),
    ),
    est: new FormControl<boolean>(true),
  };
};
