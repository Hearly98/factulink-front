import { CategoryForm } from "../core/types/cat-form";
import { FormControl } from "@angular/forms";

export const buildCategoryForm = (): {
    [K in keyof CategoryForm]: FormControl<CategoryForm[K]>
} =>
{
  return {
    cat_id: new FormControl(null),
    cat_nom: new FormControl(null),
    est: new FormControl(true)
  };
}
