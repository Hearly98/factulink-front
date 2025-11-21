import { Component, Inject, inject, OnInit, ViewContainerRef } from '@angular/core';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  ColComponent,
  ModalBodyComponent,
  ModalComponent,
  RowComponent,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TypedFormGroup } from '../../../shared/types/types-form';
import { MODULES } from '../../../core/config/permissions/modules';
import { GlobalNotification } from '../../../shared/alerts/global-notification/global-notification';
import { BaseComponent } from '@shared/base/base.component';
import { DocumentTypeForm } from '../../core/types/document-type-form';
import { buildDocumentTypeForm, documentTypeStructure } from '../../helpers';
import { DocumentTypeService } from '../../core/services/document-type.service';
import { CreateDocumentTypeModel, UpdateDocumentTypeModel } from '../../core/models';

@Component({
  selector: 'app-document-type-new-edit-modal',
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
    <c-modal alignment="center" [visible]="visible" backdrop="static">
      <c-modal-body class="modal-body">
        <c-row class="mb-2">
          <c-col [sm]="12" class="space-between">
            <h5>{{ title }}</h5>
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
                  <option [ngValue]="null">Seleccione</option>
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
        <c-row class="mt-4">
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
      </c-modal-body>
    </c-modal>
  `,
  styles: ``,
})
export class DocumentTypeNewEditModalComponent extends BaseComponent {
  form!: TypedFormGroup<DocumentTypeForm>;
  visible = false;
  structure = documentTypeStructure;
  #globalNotification = inject(GlobalNotification);
  #documentTypeService = inject(DocumentTypeService);
  #formBuilder = inject(FormBuilder);
  title = 'Crear Tipo de Documento';
  callback: any;

  constructor(@Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
    super(MODULES.DOCUMENT_TYPE, viewContainerRef);
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = this.#formBuilder.group(buildDocumentTypeForm());
  }

  openModal(idDocumentType?: number, callback: any = null) {
    this.createForm();
    this.visible = true;
    this.callback = callback;
    if (idDocumentType) {
      this.loadData(idDocumentType);
    }
  }

  loadData(idDocumentType: number) {
    this.#documentTypeService.getById(idDocumentType).subscribe({
      next: (response) => {
        if (response.isValid) {
          this.form.patchValue(response.data);
        }
      },
    });
  }

  onClose() {
    this.visible = false;
  }

  onSubmit() {
    if (this.form.valid) {
      if (this.form.value.tip_id) {
        this.update();
      } else {
        this.create();
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  create() {
    const { tip_id, ...body } = this.form.value;
    const subscription = this.#documentTypeService
      .create(body as CreateDocumentTypeModel)
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

  update() {
    const subscription = this.#documentTypeService
      .update(this.form.value as UpdateDocumentTypeModel)
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
