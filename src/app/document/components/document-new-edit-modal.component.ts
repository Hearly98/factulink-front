import { Component, Inject, inject, signal, ViewContainerRef } from '@angular/core';
import { BaseComponent } from '../../shared/base/base.component';
import { TypedFormGroup } from '../../shared/types/types-form';
import { DocumentService } from '../core/services/document.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MODULES } from '../../core/config/permissions/modules';
import {
  CardComponent,
  CardBodyComponent,
  ModalBodyComponent,
  ModalComponent,
  RowComponent,
  ColComponent,
  ButtonDirective,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { DocumentForm } from '../core/types';
import { buildDocumentForm, documentStructure } from '../helpers';
import { CreateDocumentModel } from '../core/models/create-document.model';
import { GlobalNotification } from '@shared/alerts/global-notification/global-notification';
import { UpdateDocumentModel } from '../core/models/update-document.model';

@Component({
  selector: 'app-document-new-edit-modal',
  imports: [
    CardComponent,
    CardBodyComponent,
    ModalBodyComponent,
    ModalComponent,
    RowComponent,
    ColComponent,
    ButtonDirective,
    IconDirective,
    ReactiveFormsModule,
  ],
  template: `
    <c-modal alignment="center" [visible]="visible()" backdrop="static" size="lg">
      <c-modal-body class="modal-body">
        <c-row class="mb-2">
          <c-col [sm]="12" class="space-between">
            <h5>{{ title }}</h5>
          </c-col>
          <c-col class="text-end">
            <button cButton color="secondary" class="me-2" (click)="onClose()">
              <svg cIcon name="cilX"></svg>
              Cancelar
            </button>
            <button cButton color="success" (click)="onSubmit()">
              <svg cIcon name="cilSave"></svg>
              Guardar
            </button>
          </c-col>
        </c-row>
        <c-card>
          <c-card-body [formGroup]="form">
            <c-row>
              @for(item of structure; track $index){
              <c-col [md]="item.col">
                <label for="" class="form-label">{{ item.label }}</label>
                @switch (item.type) { @case ('select') {
                <select
                  class="form-control form-select"
                  name=""
                  id=""
                  [formControlName]="item.formControlName"
                >
                  <option value="null">Seleccione</option>
                </select>
                }@default {
                <input
                  class="form-control"
                  type="text"
                  name=""
                  id=""
                  [formControlName]="item.formControlName"
                />
                } }
              </c-col>
              }
            </c-row>
          </c-card-body>
        </c-card>
      </c-modal-body>
    </c-modal>
  `,
  styles: `
    :host {
      display: block;
    }
  `,
})
export class DocumentNewEditModalComponent extends BaseComponent {
  form!: TypedFormGroup<DocumentForm>;
  visible = signal<boolean>(false);
  structure = documentStructure;
  #documentService = inject(DocumentService);
  #formBuilder = inject(FormBuilder);
  #globalNotification = inject(GlobalNotification);
  title = 'Crear Categoria';
  callback: any;

  constructor(@Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
    super(MODULES.CURRENCY, viewContainerRef);
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = this.#formBuilder.group(buildDocumentForm());
  }

  openModal(idDocument?: number, callback: any = null) {
    this.createForm();
    this.visible.set(true);
    this.callback = callback;
    if (idDocument) {
      this.loadData(idDocument);
    }
  }

  loadData(idDocument: number) {
    this.#documentService.getById(idDocument).subscribe({
      next: (response) => {
        if (response.isValid) {
          this.form.patchValue(response.data);
        }
      },
    });
  }

  onClose() {
    this.visible.set(false);
  }

  onSubmit() {
    if (this.form.valid) {
      if (this.form.value.doc_id) {
        this.update();
      } else {
        this.create();
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  create() {
    const { doc_id, ...body } = this.form.value;
    const subscription = this.#documentService.create(body as CreateDocumentModel).subscribe({
      next: (response) => {
        if (response.isValid) {
          this.#globalNotification.openAlert(response);
          this.callback(response.data);
          this.onClose();
        } else {
          this.#globalNotification.openAlert(response);
        }
      },
      error: (error) => {
        this.#globalNotification.openAlert(error.message);
      },
    });
    this.subscriptions.push(subscription);
  }

  update() {
    const subscription = this.#documentService
      .update(this.form.value as UpdateDocumentModel)
      .subscribe({
        next: (response) => {
          if (response.isValid) {
            this.#globalNotification.openAlert(response);
            this.callback(response.data);
            this.onClose();
          } else {
            this.#globalNotification.openAlert(response);
          }
        },
        error: (error) => {
          this.#globalNotification.openAlert(error.message);
        },
      });
    this.subscriptions.push(subscription);
  }
}
