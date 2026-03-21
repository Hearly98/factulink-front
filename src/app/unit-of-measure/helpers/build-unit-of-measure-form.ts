import { UnitOfMeasureForm } from "../core/types";
import { FormControl, Validators } from "@angular/forms";

export const buildUnitOfMeasureForm = (): {
    [K in keyof UnitOfMeasureForm]: FormControl<UnitOfMeasureForm[K]>
} =>
{
  return {
    und_id: new FormControl(null),
    und_nom: new FormControl(null, Validators.compose([
      Validators.required, Validators.minLength(3)
    ])),
    est: new FormControl(true)
  };
}

