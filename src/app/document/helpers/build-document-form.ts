import { FormControl } from '@angular/forms';
import { DocumentForm } from '../core/types/document.form';

export const buildDocumentForm = (): {
  [K in keyof DocumentForm]: FormControl<DocumentForm[K]>;
} => ({
  doc_nom: new FormControl(null),
  doc_tipo: new FormControl(null),
  est: new FormControl(true),
});