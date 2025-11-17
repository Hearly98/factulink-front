import { Component, Inject, inject, ViewContainerRef } from '@angular/core';
import { BaseComponent } from '../../shared/base/base.component';
import { TypedFormGroup } from '../../shared/types/types-form';
import { CurrencyForm } from '../core/types';
import { buildCurrencyForm, currencyStructure } from '../helpers';
import { CurrencyService } from '../core/services/currency.service';
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
import { GetSucursalModel } from '../../sucursal/core/models';
import { SucursalService } from '../../sucursal/core/services/sucursal.service';
import { GlobalNotification } from '../../shared/alerts/global-notification/global-notification';
import { CreateCurrencyModel } from '../core/models/create-currency.model';
import { UpdateCurrencyModel } from '../core/models/update-currency.model';

@Component({
  selector: 'app-currency-new-edit-modal',
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
                  @for(item of sucursales; track $index){
                  <option [ngValue]="item.suc_id">{{ item.suc_nom }}</option>
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
        <c-row class="mt-2">
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
  styles: `
    :host {
      display: block;
    }
  `,
})
export class CurrencyNewEditModalComponent extends BaseComponent {
  form!: TypedFormGroup<CurrencyForm>;
  visible = false;
  structure = currencyStructure;
  sucursales: GetSucursalModel[] = [];
  #currencyService = inject(CurrencyService);
  #sucursalService = inject(SucursalService);
  #globalNotification = inject(GlobalNotification);
  #formBuilder = inject(FormBuilder);
  title = 'Crear Moneda';
  callback: any;

  constructor(@Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
    super(MODULES.CURRENCY, viewContainerRef);
  }

  ngOnInit(): void {
    this.createForm();
    this.sucursalesSelectCombo();
  }

  createForm() {
    this.form = this.#formBuilder.group(buildCurrencyForm());
  }

  openModal(idCurrency?: number, callback: any = null) {
    this.createForm();
    this.callback = callback;
    this.visible = true;
    if (idCurrency) {
      this.loadData(idCurrency);
    }
  }

  loadData(idCurrency: number) {
    this.#currencyService.getById(idCurrency).subscribe({
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

  sucursalesSelectCombo() {
    this.fetchData(this.#sucursalService.getAll(), this.sucursales);
  }

  onSubmit() {
    if (this.form.valid) {
      if (this.form.value.mon_id) {
        this.update();
      } else {
        this.create();
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  create() {
    const { mon_id, ...body } = this.form.value;
    const subscription = this.#currencyService.create(body as CreateCurrencyModel).subscribe({
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
    const subscription = this.#currencyService
      .update(this.form.value as UpdateCurrencyModel)
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
