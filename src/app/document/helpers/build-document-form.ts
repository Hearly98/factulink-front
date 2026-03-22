import { FormControl, Validators } from '@angular/forms';
import { DocumentForm } from '../core/types/document.form';

export const buildDocumentForm = (): {
  [K in keyof DocumentForm]: FormControl<DocumentForm[K]>;
} => ({
  doc_id: new FormControl(null),
  doc_nom: new FormControl(
    null,
    Validators.compose([Validators.required, Validators.minLength(3)]),
  ),
  doc_cod: new FormControl(
    null,
    Validators.compose([Validators.required, Validators.minLength(2)]),
  ),
  est: new FormControl(true),
});
