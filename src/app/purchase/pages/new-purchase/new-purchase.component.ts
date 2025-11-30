import { Component, inject, Inject, OnInit, signal, ViewContainerRef } from '@angular/core';
import {
  CardBodyComponent,
  CardComponent,
  ColComponent,
  ContainerComponent,
  RowComponent,
  ButtonDirective,
} from '@coreui/angular';
import { purchaseStructure } from '../../helpers';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TypedFormGroup } from '@shared/types/types-form';
import { PurchaseForm } from '../../core/purchase.form';
import { BaseComponent } from '@shared/base/base.component';
import { MODULES } from 'src/app/core/config/permissions/modules';
import { buildPurchaseForm } from '../../helpers/build-purchase-form';
import { CurrencyService } from 'src/app/currency/core/services/currency.service';
import { SelectOption } from '@shared/types';
import { DocumentService } from 'src/app/document/core/services/document.service';
import { SearchSelectComponent } from '@shared/components/search-select.component';
import { SupplierService } from 'src/app/supplier/core/services/supplier.service';
import { ProductService } from 'src/app/products/core/services/product.service';
import { DocumentTypeService } from 'src/app/document-type/core/services/document-type.service';
import { CommonModule } from '@angular/common';
import { PurchaseDetailTableComponent } from 'src/app/purchase-detail/components/purchase-detail-table.component';
import { PurchaseDetailCreteDTOForm, PurchaseDetailForm } from 'src/app/purchase-detail/core/types';
import { buildPurchaseDetailForm } from 'src/app/purchase-detail/helpers';
import { IconDirective } from '@coreui/icons-angular';
import { PaymentMethodService } from 'src/app/payment-method/core/services/payment-method.service';
import { SucursalService } from 'src/app/sucursal/core/services/sucursal.service';
import { CategoryService } from 'src/app/category/core/services/category.service';
import { PurchaseCreateDto } from '../../core/purchase-create-dto';
import { PurchaseService } from '../../core/services/purchase.service';
import { GlobalNotification } from '@shared/alerts/global-notification/global-notification';

@Component({
  selector: 'app-new-purchase',
  standalone: true,
  imports: [
    CommonModule,
    RowComponent,
    ColComponent,
    ContainerComponent,
    CardComponent,
    CardBodyComponent,
    ReactiveFormsModule,
    SearchSelectComponent,
    IconDirective,
    PurchaseDetailTableComponent,
    ButtonDirective,
  ],
  template: `
    <c-container [formGroup]="form">
      @for (item of structure(); track $index) {
      <c-card class="mb-4">
        <c-card-body>
          <c-row>
            <c-col [md]="12">
              <h5>{{ item.title }}</h5>
            </c-col>
          </c-row>
          <c-row>
            @for (control of item.controls; track $index) {
            <c-col [md]="control.col">
              <label [for]="control.formControlName">{{ control.label }}</label>
              @switch (control.type) { @case('search-select') {
              <app-search-select
                [placeholder]="control.label"
                [bindLabel]="control.bindLabel"
                [bindValue]="control.bindValue"
                [serviceFn]="serviceMap[control.serviceFnName]"
                (itemSelected)="onSelectItem(control.formControlName, $event)"
              ></app-search-select>
              } @case('select'){
              <select class="form-control form-select" [formControlName]="control.formControlName">
                <option [ngValue]="null">Seleccione</option>
                @for (option of control.options; track $index) {
                <option [ngValue]="option.value">{{ option.label }}</option>
                }
              </select>
              } @default {
              <input
                [formControlName]="control.formControlName"
                [placeholder]="control.placeholder"
                [type]="control.type"
                class="form-control"
              />
              } }
            </c-col>
            }
            <!-- Botón para agregar producto después del search-select de producto -->
            @if (item.title === 'Agregar Producto') {
            <c-col [md]="4" class="mt-4">
              <label for="" class="d-none"></label>
              <button
                type="button"
                cButton
                color="primary"
                (click)="addProductToDetail()"
                [disabled]="!form.value.prod_id || !selectedProduct"
              >
                <svg cIcon name="cilPlus" class="me-2"></svg>
                Agregar Producto
              </button>
            </c-col>
            }
          </c-row>
        </c-card-body>
      </c-card>
      }

      <!-- Tabla de detalles -->
      <app-purchase-detail-table
        [detailsArray]="detailsArray"
        (detailRemoved)="onDetailRemoved($event)"
      ></app-purchase-detail-table>

      <!-- Botones de acción -->
      <c-card class="mb-4">
        <c-card-body>
          <c-row class="align-items-end">
            <c-col md="8" sm="12" class="mb-2">
              <label for="">Observaciones</label>
              <textarea class="form-control" formControlName="compr_coment" rows="3"></textarea>
            </c-col>
            <c-col md="4" sm="12" class="gap-2 text-end">
              <button class="me-2" type="button" cButton color="secondary" (click)="cancel()">
                Cancelar
              </button>
              <button
                type="button"
                cButton
                color="success"
                (click)="save()"
                [disabled]="!form.valid || detailsArray.length === 0"
              >
                <svg cIcon name="cilSave" class="me-2"></svg>
                Guardar Compra
              </button>
            </c-col>
          </c-row>
        </c-card-body>
      </c-card>
    </c-container>
  `,
  styles: `
    .gap-2 {
      gap: 0.5rem;
    }
  `,
})
export class NewPurchaseComponent extends BaseComponent implements OnInit {
  structure = signal(purchaseStructure());
  categories = signal<SelectOption[]>([]);
  form!: FormGroup;
  selectedProduct: any = null;

  #formBuilder = inject(FormBuilder);
  #currencyService = inject(CurrencyService);
  #documentService = inject(DocumentService);
  #supplierService = inject(SupplierService);
  #paymentMethodService = inject(PaymentMethodService);
  #productService = inject(ProductService);
  #documentTypeService = inject(DocumentTypeService);
  #sucursalService = inject(SucursalService);
  #purchaseService = inject(PurchaseService);
  #globalNotification = inject(GlobalNotification);
  constructor(@Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
    super(MODULES.PURCHASE, viewContainerRef);
  }

  ngOnInit() {
    this.form = this.#formBuilder.group(buildPurchaseForm());
    this.loadSelectCombos();
  }

  get detailsArray(): FormArray<TypedFormGroup<PurchaseDetailForm>> {
    return this.form.get('detalles') as FormArray<TypedFormGroup<PurchaseDetailForm>>;
  }

  serviceMap = {
    providerSearch: (term: string) => this.#supplierService.searchQuick(term),
    productSearch: (term: string) =>
      this.#productService.searchQuick({
        term,
        suc_id: this.form.get('suc_id')?.value,
      }),
  };

  patchSupplier(item: any) {
    this.form.patchValue({
      prov_documento: item.prov_documento,
      tip_id: item.tip_id,
      prov_direcc: item.prov_direcc,
      prov_correo: item.prov_correo,
      prov_telf: item.prov_telf,
    });
  }

  onSelectItem(formControlName: keyof PurchaseForm, item: any) {
    if (formControlName === 'prod_id') {
      this.form.patchValue({
        prod_id: item.prod_id,
      });
      this.selectedProduct = item;
      return;
    }

    const control = this.form.get(formControlName);
    if (control) {
      control.setValue(item[formControlName]);
    }

    if (formControlName === 'prov_id') {
      this.patchSupplier(item);
    }
  }

  addProductToDetail() {
    if (!this.selectedProduct) return;

    // Verificar si el producto ya existe en el detalle
    const exists = this.detailsArray.controls.some(
      (control) => control.value.prod_id === this.selectedProduct.prod_id
    );

    if (exists) {
      alert('Este producto ya ha sido agregado');
      return;
    }

    const detailForm = buildPurchaseDetailForm({
      prod_id: this.selectedProduct.prod_id,
      cantidad: 1,
      prod_nom: this.selectedProduct.prod_nom,
      prod_cod: this.selectedProduct.prod_cod,
      unidad: this.selectedProduct.unidad,
      costo_unitario: this.selectedProduct.pcompra,
      precio_compra: null,
      dscto: null,
      precio_unitario: null,
    });

    this.detailsArray.push(detailForm as any);

    // Limpiar selección
    this.form.get('prod_id')?.setValue(null);
    this.selectedProduct = null;
  }

  onDetailRemoved(index: number) {
    console.log('Producto eliminado en índice:', index);
  }

  loadSelectCombos() {
    const currencies: SelectOption[] = [];
    const documents: SelectOption[] = [];
    const paymentType: SelectOption[] = [];
    const documentTypes: SelectOption[] = [];
    const sucursalOptions: SelectOption[] = [];
    this.#currencyService.getAll().subscribe({
      next: (response) =>
        response.data.map((item) => {
          currencies.push({ value: item.mon_id, label: item.mon_nom });
        }),
    });

    this.#documentService.getAll().subscribe({
      next: (response) => {
        response.data.map((item) => {
          documents.push({ value: item.doc_id, label: item.doc_nom });
        });
      },
    });

    this.#documentTypeService.getAll().subscribe({
      next: (response) => {
        response.data.map((item) => {
          documentTypes.push({ value: item.tip_id, label: item.tip_nom });
        });
      },
    });
    this.#sucursalService.getAll().subscribe({
      next: (response) => {
        response.data.map((item) => {
          sucursalOptions.push({ value: item.suc_id, label: item.suc_nom });
        });
      },
    });

    this.#paymentMethodService.getAll().subscribe({
      next: (response) => {
        response.data.map((item) => {
          paymentType.push({ value: item.mp_id, label: item.mp_nom });
        });
      },
    });
    this.structure.set(
      purchaseStructure(currencies, paymentType, documents, documentTypes, sucursalOptions)
    );
  }

  save() {
    debugger;

    if (this.form.invalid || this.detailsArray.length === 0) {
      alert('Complete todos los campos requeridos y agregue al menos un producto');
      return;
    }
    const purchaseData: PurchaseCreateDto = {
      compr_coment: this.form.value.compr_coment,
      suc_id: this.form.value.suc_id,
      prov_id: this.form.value.prov_id,
      doc_id: this.form.value.doc_id,
      mon_id: this.form.value.mon_id,
      mp_id: this.form.value.mp_id,
      usu_id: 1,

      detalles: this.detailsArray.getRawValue().map((v) => {
        return {
          prod_id: v.prod_id,
          detc_cant: v.cantidad,
          prod_pcompra: v.precio_compra,
        } as PurchaseDetailCreteDTOForm;
      }),
    };

    this.#purchaseService.create(purchaseData).subscribe({
      next: (response) => {
        if (response.isValid) {
          this.#globalNotification.openAlert(response);
          this.cancel();
        } else {
          this.#globalNotification.openAlert(response);
        }
      },
      error: (error) => {
        this.#globalNotification.openToastAlert('Error', error.messages, 'danger');
      },
    });
  }

  cancel() {
    // Navegar de vuelta o limpiar el formulario
    this.form.reset();
    this.detailsArray.clear();
  }
}
