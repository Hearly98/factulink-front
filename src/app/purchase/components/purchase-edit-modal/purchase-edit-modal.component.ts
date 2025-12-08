import { Component, Inject, inject, signal, ViewContainerRef } from '@angular/core';
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
import { GlobalNotification } from '@shared/alerts/global-notification/global-notification';
import { BaseComponent } from '@shared/base/base.component';
import { TypedFormGroup } from '@shared/types/types-form';
import { MODULES } from 'src/app/core/config/permissions/modules';
import { PurchaseEditForm } from '../../core/types/purchase-edit.form';
import { buildPurchaseEditForm } from '../../helpers/build-purchase-edit-form';
import { purchaseEditStructure } from '../../helpers/purchase-edit-structure';
import { PurchaseService } from '../../core/services/purchase.service';
import { SupplierService } from 'src/app/supplier/core/services/supplier.service';
import { SucursalService } from 'src/app/sucursal/core/services/sucursal.service';

@Component({
  selector: 'app-purchase-edit-modal',
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
  template: `<c-modal alignment="center" [visible]="visible()" backdrop="static" size="lg">
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
              @switch (item.type) {
                @case ('select') {
              <select
                class="form-control form-select"
                name=""
                [id]="item.formControlName"
                [formControlName]="item.formControlName"
              >
                <option [ngValue]="null">Seleccione</option>
                @if(item.formControlName === 'prv_id'){
                  @for(supplier of suppliers; track $index){
                    <option [ngValue]="supplier.prv_id">{{ supplier.prv_nom }}</option>
                  }
                }
                @if(item.formControlName === 'suc_id'){
                  @for(sucursal of sucursales; track $index){
                    <option [ngValue]="sucursal.suc_id">{{ sucursal.suc_nom }}</option>
                  }
                }
                @if(item.formControlName === 'com_estado'){
                  @for(option of item.options; track $index){
                    <option [ngValue]="option.value">{{ option.label }}</option>
                  }
                }
              </select>
              }
              @case ('textarea') {
              <textarea
                class="form-control"
                name=""
                [id]="item.formControlName"
                [formControlName]="item.formControlName"
                rows="3"
              ></textarea>
              }
              @default {
              <input
                class="form-control"
                [type]="item.type"
                name=""
                [id]="item.formControlName"
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
  </c-modal>`,
  styles: ``,
})
export class PurchaseEditModalComponent extends BaseComponent {
  form!: TypedFormGroup<PurchaseEditForm>;
  visible = signal<boolean>(false);
  structure = purchaseEditStructure;
  suppliers: any[] = [];
  sucursales: any[] = [];
  #purchaseService = inject(PurchaseService);
  #supplierService = inject(SupplierService);
  #sucursalService = inject(SucursalService);
  #globalNotification = inject(GlobalNotification);
  #formBuilder = inject(FormBuilder);
  title = signal<string>('Editar Compra');
  callback: any;

  constructor(@Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
    super(MODULES.PURCHASE, viewContainerRef);
  }

  ngOnInit(): void {
    this.createForm();
    this.loadCombos();
  }

  createForm() {
    this.form = this.#formBuilder.group(buildPurchaseEditForm());
  }

  loadCombos() {
    this.fetchData(this.#supplierService.getAll(), this.suppliers);
    this.fetchData(this.#sucursalService.getAll(), this.sucursales);
  }

  openModal(idPurchase: number, callback: any = null) {
    this.createForm();
    this.visible.set(true);
    this.callback = callback;
    this.loadData(idPurchase);
  }

  loadData(idPurchase: number) {
    this.#purchaseService.get(idPurchase).subscribe({
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
      this.update();
    } else {
      this.form.markAllAsTouched();
    }
  }

  update() {
    const subscription = this.#purchaseService.update(this.form.value as any).subscribe({
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
