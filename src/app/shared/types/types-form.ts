import { FormArray, FormControl, FormGroup } from "@angular/forms";

export type TypedFormControls<T> = {
  [K in keyof T]: NonNullable<T[K]> extends any[]
  ? FormArray<any>
  : FormControl<T[K]>;
};

export type TypedFormGroup<T> = FormGroup<TypedFormControls<T>>;
