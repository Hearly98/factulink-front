import { supplierErrorMessages } from './../helpers/supplier-error-messages';
import { Component, Inject, inject, OnInit, signal, ViewContainerRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  ColComponent,
  FormControlDirective,
  FormSelectDirective,
  ModalBodyComponent,
  ModalComponent,
  RowComponent,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { TypedFormGroup } from '@shared/types/types-form';
import { MODULES } from 'src/app/core/config/permissions/modules';
import { SupplierService } from '../core/services/supplier.service';
import { buildSupplierForm, supplierStructure } from '../helpers';
import { GlobalNotification } from '@shared/alerts/global-notification/global-notification';
import { BaseComponent } from '@shared/base/base.component';
import { SupplierForm } from '../core/types/supplier-form';
import { CreateSupplierModel } from '../core/models';
import { UpdateSupplierModel } from '../core/models/update-supplier.model';
import { DocumentTypeService } from 'src/app/document-type/core/services/document-type.service';
import { GetDocumentTypeModel } from 'src/app/document-type/core/models';
import { ValidationMessagesComponent } from '@shared/components/error-messages/validation-messages.component';
@Component({
  selector: 'app-supplier-new-edit-modal',
  imports: [
    CardComponent,
    CardBodyComponent,
    ModalBodyComponent,
    FormControlDirective,
    FormSelectDirective,
    ModalComponent,
    RowComponent,
    ColComponent,
    ButtonDirective,
    IconDirective,
    ReactiveFormsModule,
    ValidationMessagesComponent
  ],
  templateUrl: "./supplier-new-edit-modal.component.html",
  styles: ``,
})
export class SupplierNewEditModalComponent extends BaseComponent implements OnInit {
  form!: TypedFormGroup<SupplierForm>;
  visible = false;
  structure = supplierStructure;
  documentTypes: GetDocumentTypeModel[] = [];
  readonly #globalNotification = inject(GlobalNotification);
  readonly #supplierService = inject(SupplierService);
  readonly #documentTypeService = inject(DocumentTypeService);
  readonly #formBuilder = inject(FormBuilder);
  title = signal('Crear Proveedor');
  callback: any;
  messages = supplierErrorMessages();
  submitted = false;
  constructor(@Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
    super(MODULES.CATEGORY, viewContainerRef);
  }

  ngOnInit(): void {
    this.createForm();
    this.documentTypeSelectCombo();
  }

  createForm() {
    this.form = this.#formBuilder.group(buildSupplierForm());
  }

  openModal(idSupplier?: number, callback: any = null) {
    this.createForm();
    this.visible = true;
    this.callback = callback;
    if (idSupplier) {
      this.loadData(idSupplier);
    }
  }

  loadData(idSupplier: number) {
    this.#supplierService.getById(idSupplier).subscribe({
      next: (response) => {
        if (response.isValid) {
          this.form.patchValue(response.data);
          this.title.set('Editar Proveedor');
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
    this.submitted = true;
    if (this.form.valid) {
      if (this.form.value.prov_id) {
        this.update();
      } else {
        this.create();
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  create() {
    const { prov_id, ...body } = this.form.value;
    const subscription = this.#supplierService.create(body as CreateSupplierModel).subscribe({
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
        this.#globalNotification.openAlert(error.error);
      },
    });
    this.subscriptions.push(subscription);
  }

  update() {
    const subscription = this.#supplierService
      .update(this.form.value as UpdateSupplierModel)
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
          this.#globalNotification.openAlert(error.error);
        },
      });
    this.subscriptions.push(subscription);
  }
}
