import { Component, inject, Inject, OnInit, signal, ViewContainerRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  ColComponent,
  ContainerComponent,
  RowComponent,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { MODULES } from 'src/app/core/config/permissions/modules';
import { GlobalNotification } from '@shared/alerts/global-notification/global-notification';
import { QuotationService } from '../core/services/quotation.service';
import { BaseComponent } from '@shared/base/base.component';
import { quotationStructure } from '../helpers/quotation-structure';
import { buildQuotationForm } from '../helpers/build-quotation-form';
import { buildQuotationDetailForm } from '../helpers/build-quotation-detail-form';
import { SelectOption } from '@shared/types';
import { SearchSelectComponent } from '@shared/components/search-select.component';
import { CustomerService } from 'src/app/customer/core/services/customer.service';
import { ProductService } from 'src/app/products/core/services/product.service';
import { SucursalService } from 'src/app/sucursal/core/services/sucursal.service';
import { CurrencyService } from 'src/app/currency/core/services/currency.service';
import { QuotationDetailTableComponent } from '../components/quotation-detail-table.component';
import { QuotationCreateDto, QuotationDetailCreateDto } from '../core/types/quotation-create-dto';

@Component({
  selector: 'app-quotation-new-edit',
  standalone: true,
  imports: [
    CommonModule,
    RowComponent,
    ColComponent,
    ContainerComponent,
    CardComponent,
    CardBodyComponent,
    IconDirective,
    ButtonDirective,
    ReactiveFormsModule,
    SearchSelectComponent,
    QuotationDetailTableComponent,
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
              <label>{{ control.label }}</label>
              @switch (control.type) { 
                @case('search-select') {
                  <app-search-select
                    [placeholder]="control.label"
                    [bindLabel]="control.bindLabel || ''"
                    [bindValue]="control.bindValue || ''"
                    [serviceFn]="control.serviceFnName ? serviceMap[control.serviceFnName] : undefined"
                    (itemSelected)="onSelectItem(control.formControlName, $event)"
                  ></app-search-select>
                } 
                @case('select') {
                  <select class="form-control form-select" [formControlName]="control.formControlName">
                    <option [ngValue]="null">Seleccione</option>
                    @for (option of control.options; track $index) {
                    <option [ngValue]="option.value">{{ option.label }}</option>
                    }
                  </select>
                } 
                @default {
                  <input
                    [formControlName]="control.formControlName"
                    [placeholder]="control.placeholder"
                    [type]="control.type"
                    class="form-control"
                  />
                } 
              }
            </c-col>
            }
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

      <app-quotation-detail-table
        [detailsArray]="detailsArray"
        (detailRemoved)="onDetailRemoved($event)"
      ></app-quotation-detail-table>

      <c-card class="mb-4">
        <c-card-body>
          <c-row class="align-items-end">
            <c-col md="8" sm="12" class="mb-2">
              <label for="">Observaciones</label>
              <textarea class="form-control" formControlName="cot_coment" rows="3"></textarea>
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
                Guardar Cotización
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
export class QuotationNewEditPage extends BaseComponent implements OnInit {
  structure = signal(quotationStructure());
  form!: FormGroup;
  selectedProduct: any = null;

  #formBuilder = inject(FormBuilder);
  #quotationService = inject(QuotationService);
  #customerService = inject(CustomerService);
  #productService = inject(ProductService);
  #sucursalService = inject(SucursalService);
  #currencyService = inject(CurrencyService);
  #globalNotification = inject(GlobalNotification);

  constructor(@Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
    super(MODULES.SALES, viewContainerRef);
  }

  ngOnInit() {
    this.form = this.#formBuilder.group(buildQuotationForm());
    this.form.patchValue({ usu_id: 1 }); // Usuario actual
    this.loadSelectCombos();
  }

  get detailsArray(): FormArray {
    return this.form.get('detalles') as FormArray;
  }

  serviceMap: Record<string, any> = {
    customerSearch: (term: string) => this.#customerService.getAll(),
    productSearch: (term: string) =>
      this.#productService.searchQuick({
        term,
        suc_id: this.form.get('suc_id')?.value,
      }),
  };

  patchCustomer(item: any) {
    this.form.patchValue({
      cli_documento: item.cli_documento,
      tip_id: item.tip_id,
      cli_direcc: item.cli_direcc,
      cli_correo: item.cli_correo,
      cli_telf: item.cli_telf,
    });
  }

  onSelectItem(formControlName: string | undefined, item: any) {
    if (!formControlName) return;
    
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

    if (formControlName === 'cli_id') {
      this.patchCustomer(item);
    }
  }

  addProductToDetail() {
    if (!this.selectedProduct) return;

    const exists = this.detailsArray.controls.some(
      (control) => control.value.prod_id === this.selectedProduct.prod_id
    );

    if (exists) {
      alert('Este producto ya ha sido agregado');
      return;
    }

    const detailForm = this.#formBuilder.group(
      buildQuotationDetailForm({
        prod_id: this.selectedProduct.prod_id,
        cantidad: 1,
        prod_nom: this.selectedProduct.prod_nom,
        prod_cod: this.selectedProduct.prod_cod,
        unidad: this.selectedProduct.unidad?.uni_nom || '',
        precio_unitario: this.selectedProduct.pventa || 0,
        dscto: 0,
        precio_total: null,
      })
    );

    this.detailsArray.push(detailForm);

    this.form.get('prod_id')?.setValue(null);
    this.selectedProduct = null;
  }

  onDetailRemoved(index: number) {
    console.log('Producto eliminado en índice:', index);
  }

  loadSelectCombos() {
    const series: SelectOption[] = [];
    const currencies: SelectOption[] = [];
    const sucursalOptions: SelectOption[] = [];

    // Cargar series de cotizaciones (doc_cod = 'COT')
    this.#quotationService.getSeries().subscribe({
      next: (response) => {
        if (response.isValid) {
          response.data.forEach((item) => {
            series.push({ value: item.ser_id, label: item.ser_num });
          });
        }
      },
    });

    this.#currencyService.getAll().subscribe({
      next: (response) =>
        response.data.forEach((item) => {
          currencies.push({ value: item.mon_id, label: item.mon_nom });
        }),
    });

    this.#sucursalService.getAll().subscribe({
      next: (response) => {
        response.data.forEach((item) => {
          sucursalOptions.push({ value: item.suc_id, label: item.suc_nom });
        });
      },
    });

    this.structure.set(quotationStructure(series, currencies, sucursalOptions));
  }

  save() {
    if (this.form.invalid || this.detailsArray.length === 0) {
      alert('Complete todos los campos requeridos y agregue al menos un producto');
      return;
    }

    const quotationData: QuotationCreateDto = {
      serie_id: this.form.value.serie_id,
      suc_id: this.form.value.suc_id,
      usu_id: this.form.value.usu_id,
      cli_id: this.form.value.cli_id,
      mon_id: this.form.value.mon_id,
      fechaEmision: this.form.value.fechaEmision,
      cot_coment: this.form.value.cot_coment || '',
      detalles: this.detailsArray.getRawValue().map((v) => {
        return {
          prod_id: v.prod_id,
          detc_cant: v.cantidad,
          prod_pventa: v.precio_unitario,
        } as QuotationDetailCreateDto;
      }),
    };

    this.#quotationService.create(quotationData).subscribe({
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
    this.form.reset();
    this.detailsArray.clear();
  }
}
