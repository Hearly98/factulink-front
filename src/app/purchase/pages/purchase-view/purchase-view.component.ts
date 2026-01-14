import { Component, inject, Inject, OnInit, signal, ViewContainerRef } from '@angular/core';
import {
  CardBodyComponent,
  CardComponent,
  ColComponent,
  ContainerComponent,
  RowComponent,
  ButtonDirective,
  CardHeaderComponent,
  TableDirective,
} from '@coreui/angular';
import { purchaseStructure } from '../../helpers';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TypedFormGroup } from '@shared/types/types-form';
import { BaseComponent } from '@shared/base/base.component';
import { MODULES } from 'src/app/core/config/permissions/modules';
import { buildPurchaseForm } from '../../helpers/build-purchase-form';
import { CurrencyService } from 'src/app/currency/core/services/currency.service';
import { SelectOption } from '@shared/types';
import { DocumentService } from 'src/app/document/core/services/document.service';
import { DocumentTypeService } from 'src/app/document-type/core/services/document-type.service';
import { CommonModule } from '@angular/common';
import { PurchaseDetailTableComponent } from 'src/app/purchase-detail/components/purchase-detail-table.component';
import { PurchaseDetailForm } from 'src/app/purchase-detail/core/types';
import { buildPurchaseDetailForm } from 'src/app/purchase-detail/helpers';
import { IconDirective } from '@coreui/icons-angular';
import { PaymentMethodService } from 'src/app/payment-method/core/services/payment-method.service';
import { SucursalService } from 'src/app/sucursal/core/services/sucursal.service';
import { PurchaseService } from '../../core/services/purchase.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-purchase-view',
  standalone: true,
  imports: [
    CommonModule,
    RowComponent,
    ColComponent,
    ContainerComponent,
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    ReactiveFormsModule,
    IconDirective,
    PurchaseDetailTableComponent,
    ButtonDirective,
    TableDirective,
  ],
  template: `
    <c-container [formGroup]="form">
      <c-row class="mb-3">
        <c-col>
          <div class="d-flex justify-content-between align-items-center">
             <h4>Detalle de Compra</h4>
             <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                  <li class="breadcrumb-item"><a href="javascript:void(0)" (click)="goBack()">Compras</a></li>
                  <li class="breadcrumb-item active" aria-current="page">Ver</li>
                </ol>
             </nav>
          </div>
        </c-col>
      </c-row>

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
                <input
                  [value]="getSearchSelectValue(control.formControlName)"
                  class="form-control"
                  disabled
                />
              } @case('select'){
              <select class="form-control form-select" [formControlName]="control.formControlName">
                <option [ngValue]="null">Seleccione</option>
                @for (option of control.options; track $index) {
                <option [ngValue]="option.value">{{ option.label }}</option>
                }
              </select>
              } 
              @case('checkbox') {
                <br>
              <input
                type="checkbox"
                [formControlName]="control.formControlName"
              />
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
          </c-row>
        </c-card-body>
      </c-card>
      }

      <!-- Tabla de detalles -->
      <app-purchase-detail-table
        [detailsArray]="detailsArray"
        [showActions]="false"
      ></app-purchase-detail-table>

       <!-- Pagos (UI Placeholder) -->
       <c-card class="mb-4 border-success">
        <c-card-header class="bg-success text-white">
          <strong>Datos de Pago</strong>
        </c-card-header>
        <c-card-body>
          <c-row class="g-3">
            <c-col md="2">
              <label>Medio de Pago</label>
              <select class="form-select">
                <option>Seleccione..</option>
              </select>
            </c-col>
            <c-col md="2">
              <label>Medio Pago Detalle</label>
              <select class="form-select">
                <option>Seleccione..</option>
              </select>
            </c-col>
            <c-col md="2">
              <label>Fecha</label>
              <input type="date" class="form-control">
            </c-col>
            <c-col md="2">
              <label>Hora</label>
              <input type="text" class="form-control" placeholder="[ Hora de Pago ]">
            </c-col>
            <c-col md="2">
              <label>Nro de Operación</label>
              <input type="text" class="form-control" placeholder="[ Nro. de Operación ]">
            </c-col>
            <c-col md="2">
              <label>Monto</label>
              <div class="input-group">
                <span class="input-group-text">S/</span>
                <input type="text" class="form-control">
              </div>
            </c-col>
            <c-col md="10">
              <label>Observaciones</label>
              <textarea class="form-control" placeholder="[ Observaciones ]" rows="1"></textarea>
            </c-col>
            <c-col md="2" class="d-flex align-items-end">
              <button cButton color="success" class="w-100">
                <svg cIcon name="cilSave" class="me-2"></svg>
                Guardar
              </button>
            </c-col>
          </c-row>
        </c-card-body>
      </c-card>

      <c-card class="mb-4 border-success">
        <c-card-header class="bg-success text-white py-1">
          <strong class="fs-6">Pagos realizados</strong>
        </c-card-header>
        <c-card-body class="p-0">
          <table cTable striped class="mb-0">
            <thead class="table-light">
              <tr>
                <th>Nro.</th>
                <th>Fecha de Pago</th>
                <th>Hora de Pago</th>
                <th>Forma de Pago</th>
                <th>Deuda</th>
                <th>Monto Pagado</th>
                <th>Saldo</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>01. F001-0028802</td>
                <td>martes 13 de enero del 2026</td>
                <td>00:00</td>
                <td><svg cIcon name="cilCreditCard"></svg></td>
                <td>S/. 0.00</td>
                <td>S/. 0.00</td>
                <td>S/. 0.00</td>
                <td class="text-center">
                  <button cButton color="info" size="sm" variant="ghost">
                    <svg cIcon name="cilPrint"></svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </c-card-body>
      </c-card>

      <!-- Botones de acción -->
      <c-card class="mb-4">
        <c-card-body>
          <c-row class="align-items-end">
            <c-col md="8" sm="12" class="mb-2">
              <label for="">Observaciones</label>
              <textarea class="form-control" formControlName="compr_coment" rows="3"></textarea>
            </c-col>
            <c-col md="4" sm="12" class="gap-2 text-end">
              <button class="me-2" type="button" cButton color="secondary" (click)="goBack()">
                Volver
              </button>
              <button
                type="button"
                cButton
                color="info"
                class="text-white"
              >
                <svg cIcon name="cilPrint" class="me-2"></svg>
                Imprimir
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
    .breadcrumb {
      margin-bottom: 0;
    }
    .fs-7 {
      font-size: 0.875rem;
    }
  `,
})
export class PurchaseViewComponent extends BaseComponent implements OnInit {
  structure = signal(purchaseStructure());
  form!: FormGroup;
  purchaseData: any = null;

  #formBuilder = inject(FormBuilder);
  #currencyService = inject(CurrencyService);
  #documentService = inject(DocumentService);
  #paymentMethodService = inject(PaymentMethodService);
  #documentTypeService = inject(DocumentTypeService);
  #sucursalService = inject(SucursalService);
  #purchaseService = inject(PurchaseService);
  #route = inject(ActivatedRoute);
  #router = inject(Router);

  constructor(@Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
    super(MODULES.PURCHASE, viewContainerRef);
  }

  ngOnInit() {
    this.form = this.#formBuilder.group(buildPurchaseForm());
    this.loadSelectCombos();

    this.#route.params.subscribe((params) => {
      const id = params['id'];
      if (id && id !== 'undefined') {
        this.loadPurchase(id);
      }
    });
  }

  get detailsArray(): FormArray<TypedFormGroup<PurchaseDetailForm>> {
    return this.form.get('detalles') as FormArray<TypedFormGroup<PurchaseDetailForm>>;
  }

  loadPurchase(id: number) {
    this.#purchaseService.get(id).subscribe({
      next: (response) => {
        if (response.isValid) {
          this.purchaseData = response.data;
          this.form.patchValue({
            ...response.data,
            fechaEmision: response.data.fechaEmision ? new Date(response.data.fechaEmision).toISOString().split('T')[0] : null,
            prov_documento: response.data.proveedor?.prov_documento,
            prov_direcc: response.data.proveedor?.prov_direcc,
            prov_correo: response.data.proveedor?.prov_correo,
            prov_telf: response.data.proveedor?.prov_telf,
            tip_id: response.data.proveedor?.tip_id,
          });

          if (response.data.detalles) {
            this.detailsArray.clear();
            response.data.detalles.forEach((det: any) => {
              this.detailsArray.push(
                buildPurchaseDetailForm({
                  prod_id: det.prod_id,
                  cantidad: det.detc_cant,
                  prod_nom: det.producto?.prod_nom,
                  prod_cod_interno: det.producto?.prod_cod_interno,
                  unidad: det.producto?.unidad,
                  costo_unitario: det.prod_pcompra,
                  precio_compra: det.prod_pcompra,
                  dscto: 0,
                  precio_unitario: det.prod_pcompra,
                }) as any
              );
            });
          }

          this.form.disable();
        }
      },
    });
  }

  getSearchSelectValue(controlName: string): string {
    if (!this.purchaseData) return '';
    if (controlName === 'prov_id') return this.purchaseData.proveedor?.prov_nom || '';
    if (controlName === 'prod_id') return ''; // No aplica en vista detalle general
    return '';
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

  goBack() {
    this.#router.navigate(['/listado-compras']);
  }
}
