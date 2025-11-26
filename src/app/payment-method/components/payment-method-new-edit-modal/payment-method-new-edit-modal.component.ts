import { Component, Inject, inject, ViewContainerRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
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
import { BaseComponent } from '@shared/base/base.component';
import { TypedFormGroup } from '@shared/types/types-form';
import { PaymentMethodForm } from '../../core/types';
import { buildPaymentMethodForm, paymentMethodStructure } from '../../helpers';
import { GlobalNotification } from '@shared/alerts/global-notification/global-notification';
import { PaymentMethodService } from '../../core/services/payment-method.service';
import { MODULES } from 'src/app/core/config/permissions/modules';
import { CreatePaymentMethodModel, UpdatePaymentMethodModel } from '../../core/models';

@Component({
  selector: 'app-payment-method-new-edit-modal',
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
  template: `<c-modal alignment="center" [visible]="visible" backdrop="static">
    <c-modal-body class="modal-body">
      <c-row class="mb-2">
        <c-col [sm]="6" class="space-between">
          <h5>{{ title }}</h5>
        </c-col>
      </c-row>
      <c-card>
        <c-card-body [formGroup]="form">
          <c-row>
            @for(item of structure; track $index){
            <c-col [md]="item.col">
              <label for="" class="form-label">{{ item.label }}</label>
              <input
                class="form-control"
                type="text"
                name=""
                id=""
                [formControlName]="item.formControlName"
              />
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
  </c-modal>`,
  styles: ``,
})
export class PaymentMethodNewEditModalComponent extends BaseComponent {
  form!: TypedFormGroup<PaymentMethodForm>;
  visible = false;
  structure = paymentMethodStructure;
  #globalNotification = inject(GlobalNotification);
  #paymentMethodService = inject(PaymentMethodService);
  #formBuilder = inject(FormBuilder);
  title = 'Crear Categoria';
  callback: any;

  constructor(@Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
    super(MODULES.PAYMENT_METHOD, viewContainerRef);
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.form = this.#formBuilder.group(buildPaymentMethodForm());
  }

  openModal(idCategory?: number, callback: any = null) {
    this.createForm();
    this.visible = true;
    this.callback = callback;
    if (idCategory) {
      this.loadData(idCategory);
    }
  }

  loadData(idCategory: number) {
    this.#paymentMethodService.getById(idCategory).subscribe({
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
      if (this.form.value.mp_id) {
        this.update();
      } else {
        this.create();
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  create() {
    const { mp_id, ...body } = this.form.value;
    const subscription = this.#paymentMethodService
      .create(body as CreatePaymentMethodModel)
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
    const subscription = this.#paymentMethodService
      .update(this.form.value as UpdatePaymentMethodModel)
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
