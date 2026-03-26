import { Component, inject, Inject, OnInit, signal, ViewContainerRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
import { QuotationCreateDto } from '../core/types/quotation-create-dto';
import { messages } from '../helpers';
import { ValidationMessagesComponent } from '@shared/components/error-messages/validation-messages.component';
import { QuotationDetailCreateDto, QuotationForm } from '../core/types';
import { TypedFormGroup } from '@shared/types/types-form';
import { PaymentMethodService } from 'src/app/payment-method/core/services/payment-method.service';
import { AlmacenService } from 'src/app/almacen/core/services/almacen.service';

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
    ValidationMessagesComponent,
  ],
  template: `
    <c-container [formGroup]="form">
      @if(form.get('numero_completo')?.value) {
        <c-row>
          <c-col md="12">
            <h5>Cotización {{ form.get('numero_completo')?.value }}</h5>
          </c-col>
        </c-row>
      }
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
            <c-col [md]="control.col" class="mb-2">
              <label>{{ control.label }}</label>
              @switch (control.type) { 
                @case('search-select') {
                  <app-search-select
                    [placeholder]="control.label"
                    [bindLabel]="control.bindLabel || ''"
                    [bindValue]="control.bindValue || ''"
                    [serviceFn]="control.serviceFnName ? serviceMap[control.serviceFnName] : undefined"
                    [disabled]="control.formControlName === 'prod_id' && !form.value.suc_id"
                    [showError]="control.formControlName === 'prod_id' && sucursalError()"
                    [errorMessage]="sucursalError() ? 'Seleccione una sucursal primero' : ''"
                    (onFocus)="onProductSearchFocus()"
                    (itemSelected)="onSelectItem(control.formControlName, $event)"
                    [initialValue]="control.formControlName ? searchSelectLabels[control.formControlName] : ''"
                  ></app-search-select>
                } 
                @case('select') {
                  <select class="form-control form-select" [formControlName]="control.formControlName"
                   [class.is-invalid]="
                      (control.formControlName === 'prod_id' && sucursalError()) ||
                      (form.get(control.formControlName)?.invalid && form.get(control.formControlName)?.touched)
                    "
                    (change)="onSelectChange(control.formControlName, $event)"
                  >
                    <option [ngValue]="null">Seleccione</option>
                    @for (option of control.formControlName === 'alm_id' ? almacenOptions : control.options; track $index) {
                    <option [ngValue]="option.value">{{ option.label }}</option>
                    }
                  </select>
                  @if (control.formControlName === 'prod_id' && sucursalError()) {
                    <div class="invalid-feedback d-block">Seleccione una sucursal primero</div>
                  }
                  <app-validation-messages [controlName]="control.formControlName" [form]="form" [messages]="errorMessages"></app-validation-messages>
                } 
                @case('textarea') {
                  <textarea
                    [formControlName]="control.formControlName"
                    [placeholder]="control.placeholder"
                    class="form-control"
                     [class.is-invalid]="
                      form.get(control.formControlName)?.invalid &&
                      form.get(control.formControlName)?.touched
                    "
                  ></textarea>
                  <app-validation-messages [controlName]="control.formControlName" [form]="form" [messages]="errorMessages"></app-validation-messages>
                }
                @default {
                  <input
                    [formControlName]="control.formControlName"
                    [placeholder]="control.placeholder"
                    [type]="control.type"
                    class="form-control"
                     [class.is-invalid]="
                      form.get(control.formControlName)?.invalid &&
                      form.get(control.formControlName)?.touched
                    "
                  />
                  <app-validation-messages [controlName]="control.formControlName" [form]="form" [messages]="errorMessages"></app-validation-messages>
                } 
              }
              @if (control.showControlName) {
                <div class="mt-1 d-flex gap-2 align-items-center">
                  <span class="text-muted small">¿Mostrar?</span>
                  <input
                    class="form-check-input mt-0"
                    type="checkbox"
                    [formControlName]="control.showControlName"
                  />
                </div>
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
            <c-col md="12" sm="12" class="mt-4">
              <app-quotation-detail-table
                [detailsArray]="detailsArray"
                [igvRequerido]="form.get('igv_requerido')?.value ?? false"
                (detailRemoved)="onDetailRemoved($event)"
              ></app-quotation-detail-table>
            </c-col>
            }
          </c-row>
        </c-card-body>
      </c-card>
      }



          <c-row class="align-items-end mb-4">
            <c-col md="12" sm="12" class="gap-2 text-end">
              <button class="me-2" type="button" cButton color="secondary" (click)="cancel()">
                Cancelar
              </button>
              <button
                type="button"
                cButton
                color="success"
                (click)="save()"
              >
                <svg cIcon name="cilSave" class="me-2"></svg>
                Guardar Cotización
              </button>
            </c-col>
          </c-row>
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
  form!: TypedFormGroup<QuotationForm>;
  selectedProduct: any = null;
  quotaId = signal<number | null>(null);
  searchSelectLabels: Record<string, string> = {};
  errorMessages = messages;
  almacenOptions: SelectOption[] = [];
  sucursalError = signal(false);
  #formBuilder = inject(FormBuilder);
  #paymentMethodService = inject(PaymentMethodService);
  #quotationService = inject(QuotationService);
  #customerService = inject(CustomerService);
  #productService = inject(ProductService);
  #sucursalService = inject(SucursalService);
  #currencyService = inject(CurrencyService);
  #almacenService = inject(AlmacenService);
  #globalNotification = inject(GlobalNotification);
  #route = inject(ActivatedRoute);
  #router = inject(Router);

  constructor(@Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
    super(MODULES.SALES, viewContainerRef);
  }

  ngOnInit() {
    this.form = this.#formBuilder.group(buildQuotationForm());
    this.loadSelectCombos();
    this.checkEditMode();
  }

  checkEditMode() {
    const id = this.#route.snapshot.params['id'];
    if (id) {
      this.quotaId.set(Number(id));
      this.loadQuotation(this.quotaId()!);
    }
  }

  loadQuotation(id: number) {
    this.#quotationService.getById(id).subscribe({
      next: (response) => {
        if (response.isValid && response.data) {
          const data = response.data;

          // Formatear fechas para input type="date" (YYYY-MM-DD)
          const fechaEmision = data.fecha_emision ? data.fecha_emision.substring(0, 10) : '';
          const fechaValido = data.fecha_valido_hasta ? data.fecha_valido_hasta.substring(0, 10) : '';

          const { detalles, ...rest } = data;

          this.form.patchValue({
            ...rest,
            fecha_emision: fechaEmision,
            fecha_valido_hasta: fechaValido,
          });

          // Labels para search-select
          if (data.cliente) {
            this.searchSelectLabels['cli_id'] = data.cliente.cli_nom;
          }

          this.patchCustomer(data.cliente);


          // Cargar detalles
          this.detailsArray.clear();
          data.detalles.forEach((det: any) => {
            this.detailsArray.push(this.#formBuilder.group(buildQuotationDetailForm({
              prod_id: det.prod_id,
              cantidad: det.cantidad,
              prod_nom: det.producto?.prod_nom || det.descripcion,
              prod_cod: det.producto?.prod_cod_interno || '',
              unidad: det.producto?.unidad.und_nom || '',
              precio_unitario: det.precio_unitario,
              dscto: det.descuento || 0,
              precio_total: (det.cantidad * det.precio_unitario) - (det.descuento || 0)
            })));
          });
        }
      }
    });
  }

  get detailsArray(): FormArray {
    return this.form.get('detalles') as FormArray;
  }

  serviceMap: Record<string, any> = {
    customerSearch: (term: string) => this.#customerService.getAll(),
    productSearch: (term: string) => {
      if (!this.form.value.suc_id) {
        this.sucursalError.set(true);
        return { data: [] };
      }
      this.sucursalError.set(false);
      return this.#productService.searchQuick({
        term,
        suc_id: this.form.value.suc_id!,
        alm_id: this.form.value.alm_id || undefined,
      });
    },
  };

  onProductSearchFocus() {
    if (!this.form.value.suc_id) {
      this.sucursalError.set(true);
    }
  }

  onSelectChange(controlName: string | undefined, event: Event) {
    if (!controlName) return;
    
    const value = (event.target as HTMLSelectElement).value;
    
    if (controlName === 'suc_id' && value) {
      this.form.patchValue({ suc_id: parseInt(value), alm_id: null });
      this.loadAlmacenesBySucursal(parseInt(value));
      this.selectedProduct = null;
    } else if (controlName === 'alm_id' && value) {
      this.form.patchValue({ alm_id: parseInt(value) });
    }
  }

  loadAlmacenesBySucursal(sucId: number) {
    this.#almacenService.getAll().subscribe({
      next: (response) => {
        const filteredAlmacenes = response.data
          .filter((a: any) => a.suc_id === sucId)
          .map((item: any) => ({ value: item.almacen_id, label: item.nombre }));
        this.almacenOptions = filteredAlmacenes;
        
        const currentStructure = this.structure();
        const updatedControls = currentStructure[1].controls.map(control => {
          if (control.formControlName === 'alm_id') {
            return { ...control, options: filteredAlmacenes };
          }
          return control;
        });
        
        this.structure.set([
          currentStructure[0],
          { ...currentStructure[1], controls: updatedControls },
          ...currentStructure.slice(2)
        ]);
      },
    });
  }

  patchCustomer(item: any) {
    this.form.patchValue({
      cli_documento: item.cli_documento,
      tip_id: item.tip_id,
      cli_direcc: item.cli_direcc,
      correo_contacto: item.cli_correo,
      telefono_contacto: item.cli_telf,
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
        unidad: this.selectedProduct.unidad || '',
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
    // La eliminación ya se hace en el componente de tabla por simplicidad, 
    // pero si quisiéramos hacer algo más aquí lo podríamos hacer.
    console.log('Producto eliminado en índice:', index);
  }

  loadSelectCombos() {
    const series: SelectOption[] = [];
    const currencies: SelectOption[] = [];
    const sucursalOptions: SelectOption[] = [];
    const paymentMethods: SelectOption[] = [];

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

    this.#paymentMethodService.getAll().subscribe({
      next: (response) => {
        response.data.forEach((item) => {
          paymentMethods.push({ value: item.mp_id, label: item.mp_nom });
        });
      },
    });

    this.structure.set(quotationStructure(currencies, sucursalOptions, paymentMethods));
  }

  save() {
    debugger;
    if (this.form.invalid || this.detailsArray.length === 0) {
      this.#globalNotification.openToastAlert('Validación', 'Complete todos los campos requeridos');
      this.form.markAllAsTouched();
      const invalidControls: { campo: string; errores: any }[] = [];
      const controls = this.form.controls;
      Object.keys(controls).forEach((name) => {
        const control = controls[name as keyof typeof controls];
        if (control.invalid) {
          invalidControls.push({
            campo: name,
            errores: control.errors
          });
        }
      });
      console.table(invalidControls); // Esto te dará una tabla clara en la consola
      return;
    }

    const quotationData: QuotationCreateDto = {
      ...(this.form.getRawValue() as any),
      detalles: this.detailsArray.getRawValue().map((v) => {
        return {
          prod_id: v.prod_id,
          cantidad: v.cantidad,
          precio_unitario: v.precio_unitario,
          descripcion: v.prod_nom,
          descuento: v.dscto || 0,
        } as QuotationDetailCreateDto;
      }),
    };

    const request = this.quotaId()
      ? this.#quotationService.update(this.quotaId()!, quotationData)
      : this.#quotationService.create(quotationData);

    request.subscribe({
      next: (response) => {
        if (response.isValid) {
          this.#globalNotification.openAlert(response);
          this.#router.navigate(['/historial-cotizaciones']);
        } else {
          this.#globalNotification.openAlert(response);
        }
      },
      error: (error) => {
        this.#globalNotification.openToastAlert('Error', error.message, 'danger');
      },
    });
  }

  cancel() {
    this.form.reset();
    this.detailsArray.clear();
  }
}
