import { Component, Inject, inject, OnInit, signal, ViewContainerRef } from '@angular/core';
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
import { BaseComponent } from '@shared/base/base.component';
import { GlobalNotification } from '@shared/alerts/global-notification/global-notification';
import { TypedFormGroup } from '@shared/types/types-form';
import { CustomerForm } from '../core/types/customer-form';
import { buildCustomerForm, customerStructure } from '../helpers';
import { CustomerService } from '../core/services/customer.service';
import { MODULES } from 'src/app/core/config/permissions/modules';
import { CreateCustomerModel, UpdateCustomerModel } from '../core/models';
import { GetDocumentTypeModel } from 'src/app/document-type/core/models';
import { DocumentTypeService } from 'src/app/document-type/core/services/document-type.service';

@Component({
  selector: 'app-customer-new-edit-modal',
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
          <c-col [sm]="6" class="space-between">
            <h5>{{ title() }}</h5>
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
                  @for(item of documentTypes; track $index){
                  <option [ngValue]="item.tip_id">{{ item.tip_nom }}</option>
                  }
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
export class CustomerNewEditModalComponent extends BaseComponent implements OnInit {
  form!: TypedFormGroup<CustomerForm>;
  visible = false;
  structure = customerStructure;
  documentTypes: GetDocumentTypeModel[] = [];
  #documentTypeService = inject(DocumentTypeService);
  #globalNotification = inject(GlobalNotification);
  #customerService = inject(CustomerService);
  #formBuilder = inject(FormBuilder);
  title = signal('Crear Cliente');
  callback: any;

  constructor(@Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
    super(MODULES.CUSTOMER, viewContainerRef);
  }

  ngOnInit(): void {
    this.createForm();
    this.documentTypeSelectCombo();
  }

  createForm() {
    this.form = this.#formBuilder.group(buildCustomerForm());
  }

  openModal(idCustomer?: number, callback: any = null) {
    this.createForm();
    this.visible = true;
    this.callback = callback;
    if (idCustomer) {
      this.title.set('Editar Cliente');
      this.loadData(idCustomer);
    }
  }

  loadData(idCustomer: number) {
    this.#customerService.getById(idCustomer).subscribe({
      next: (response) => {
        if (response.isValid) {
          this.form.patchValue(response.data);
        }
      },
    });
  }

  documentTypeSelectCombo() {
    this.fetchData(this.#documentTypeService.getAll(), this.documentTypes);
  }

  onClose() {
    this.visible = false;
  }

  onSubmit() {
    if (this.form.valid) {
      if (this.form.value.cli_id) {
        this.update();
      } else {
        this.create();
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  create() {
    const { cli_id, ...body } = this.form.value;
    const subscription = this.#customerService.create(body as CreateCustomerModel).subscribe({
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
    const subscription = this.#customerService
      .update(this.form.value as UpdateCustomerModel)
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
