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
import { PurchaseDetailForm } from 'src/app/purchase-detail/core/types';
import { buildPurchaseDetailForm } from 'src/app/purchase-detail/helpers';
import { IconDirective } from '@coreui/icons-angular';

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
                [disabled]="!form.value.product_id || !selectedProduct"
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
        [categories]="categories()"
        (detailRemoved)="onDetailRemoved($event)"
      ></app-purchase-detail-table>

      <!-- Botones de acción -->
      <c-card class="mb-4">
        <c-card-body>
          <c-row class="align-items-end">
            <c-col md="8" sm="12" class="mb-2">
              <label for="">Observaciones</label>
              <textarea class="form-control" formControlName="observaciones" rows="3"></textarea>
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
  #productService = inject(ProductService);
  #documentTypeService = inject(DocumentTypeService);

  constructor(@Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
    super(MODULES.PURCHASE, viewContainerRef);
  }

  ngOnInit() {
    this.form = this.#formBuilder.group(buildPurchaseForm());
    this.loadSelectCombos();
    this.loadCategories();
  }

  get detailsArray(): FormArray<TypedFormGroup<PurchaseDetailForm>> {
    return this.form.get('details') as FormArray<TypedFormGroup<PurchaseDetailForm>>;
  }

  serviceMap = {
    providerSearch: (term: string) => this.#supplierService.searchQuick(term),
    productSearch: (term: string) => this.#productService.searchQuick(term),
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
    // Excluir 'details' ya que es un FormArray, no un FormControl
    if (formControlName === 'details') return;

    const control = this.form.get(formControlName);
    if (control) {
      control.setValue(item[formControlName]);
    }

    if (formControlName === 'prov_id') {
      this.patchSupplier(item);
    }

    if (formControlName === 'product_id') {
      this.selectedProduct = item;
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
      prod_nom: this.selectedProduct.prod_nom,
      cat_id: this.selectedProduct.cat_id,
      cat_nom: this.selectedProduct.cat_nom,
      stock: this.selectedProduct.stock || 0,
      unid_med: this.selectedProduct.unid_med || 'UND',
      cantidad: 1,
      precio: this.selectedProduct.precio || 0,
      subtotal: this.selectedProduct.precio || 0,
    });

    this.detailsArray.push(detailForm as any);

    // Limpiar selección
    this.form.get('product_id')?.setValue(null);
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

    this.structure.set(purchaseStructure(currencies, paymentType, documents, documentTypes));
  }

  loadCategories() {
    // Asumiendo que tienes un servicio de categorías
    // this.#categoryService.getAll().subscribe({
    //   next: (response) => {
    //     const cats = response.data.map(item => ({
    //       value: item.cat_id,
    //       label: item.cat_nom
    //     }));
    //     this.categories.set(cats);
    //   }
    // });

    // Mock temporal
    this.categories.set([
      { value: 1, label: 'Electrónica' },
      { value: 2, label: 'Alimentos' },
      { value: 3, label: 'Bebidas' },
      { value: 4, label: 'Limpieza' },
    ]);
  }

  save() {
    if (this.form.invalid || this.detailsArray.length === 0) {
      alert('Complete todos los campos requeridos y agregue al menos un producto');
      return;
    }

    const purchaseData = {
      ...this.form.getRawValue(),
      details: this.detailsArray.getRawValue(),
    };

    console.log('Datos de compra a guardar:', purchaseData);
    // Aquí llamarías a tu servicio para guardar la compra
    // this.#purchaseService.create(purchaseData).subscribe(...)
  }

  cancel() {
    // Navegar de vuelta o limpiar el formulario
    this.form.reset();
    this.detailsArray.clear();
  }
}
