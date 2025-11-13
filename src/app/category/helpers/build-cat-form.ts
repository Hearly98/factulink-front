import { CategoryForm } from "../core/types/cat-form";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";

export const buildCategoryForm = (): {
    [K in keyof CategoryForm]: FormControl<CategoryForm[K]>
} =>
{
  return {
    cat_nom: new FormControl(null),
    est: new FormControl(true),
    suc_id: new FormControl(null)
  };
}