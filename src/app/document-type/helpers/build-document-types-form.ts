import { FormControl, Validators } from '@angular/forms';
import { DocumentTypeForm } from '../core/types/document-type-form';

export const buildDocumentTypeForm = (): {
  [K in keyof DocumentTypeForm]: FormControl<DocumentTypeForm[K]>;
} => {
  return {
    tip_id: new FormControl(null),
    tip_cod: new FormControl(null, Validators.compose([Validators.required])),
    tip_descr: new FormControl(null),
    est: new FormControl(true),
    tip_nom: new FormControl(
      null,
      Validators.compose([Validators.compose([Validators.required, Validators.minLength(3)])]),
    ),
  };
};
