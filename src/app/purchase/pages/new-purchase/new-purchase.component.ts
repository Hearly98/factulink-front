import { Component, inject, Inject, OnInit, signal, ViewContainerRef } from '@angular/core';
import {
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  ContainerComponent,
  RowComponent,
} from '@coreui/angular';
import { purchaseStructure } from '../../helpers';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
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

@Component({
  selector: 'app-new-purchase',
  imports: [
    RowComponent,
    ColComponent,
    ContainerComponent,
    CardComponent,
    CardBodyComponent,
    ReactiveFormsModule,
    SearchSelectComponent,
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
                [type]="control.type"
                class="form-control"
              />
              } }
            </c-col>
            }
          </c-row>
        </c-card-body>
      </c-card>
      }
    </c-container>
  `,
  styles: ``,
})
export class NewPurchaseComponent extends BaseComponent implements OnInit {
  structure = signal(purchaseStructure());
  form!: TypedFormGroup<PurchaseForm>;
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
    this.form.controls[formControlName].setValue(item[formControlName]);

    if (formControlName === 'prov_id') {
      this.patchSupplier(item);
    }

    if (formControlName === 'product_id') {
      //this.patchProduct(item);
    }
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
}
