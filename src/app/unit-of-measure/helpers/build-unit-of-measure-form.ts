import { UnitOfMeasureForm } from "../core/types";
import { FormControl } from "@angular/forms";

export const buildUnitOfMeasureForm = (): {
    [K in keyof UnitOfMeasureForm]: FormControl<UnitOfMeasureForm[K]>
} =>
{
  return {
    und_id: new FormControl(null),
    und_nom: new FormControl(null),
    suc_id: new FormControl(null),
    est: new FormControl(true)
  };
}

