import { FormControl } from '@angular/forms';
import { DocumentForm } from '../core/types/document.form';

export const buildDocumentForm = (): {
  [K in keyof DocumentForm]: FormControl<DocumentForm[K]>;
} => ({
  doc_id: new FormControl(null),
  doc_nom: new FormControl(null),
  doc_cod: new FormControl(null),
  est: new FormControl(true),
});
