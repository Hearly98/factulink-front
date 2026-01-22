import { Component, inject, Inject, OnInit, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
import { BaseComponent } from '@shared/base/base.component';
import { MODULES } from 'src/app/core/config/permissions/modules';
import { SelectOption } from '@shared/types';
import { SearchSelectComponent } from '@shared/components/search-select.component';
import { SaleService } from '../../core/services/sale.service';
import { DocumentService } from 'src/app/document/core/services/document.service';
import { CustomerService } from 'src/app/customer/core/services/customer.service';
import { SucursalService } from 'src/app/sucursal/core/services/sucursal.service';
import { ProductService } from 'src/app/products/core/services/product.service';
import { GlobalNotification } from '@shared/alerts/global-notification/global-notification';
import { SerieModel } from 'src/app/series/core/models/serie.model';

@Component({
  selector: 'app-new-sale',
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
    ButtonDirective,
  ],
  template: `
    <c-container [formGroup]="form">
      <c-card class="mb-4">
        <c-card-body>
          <c-row>
            <c-col [md]="12">
              <h5>Información de la Venta</h5>
            </c-col>
          </c-row>
          <c-row>
            <c-col [md]="3">
              <label for="doc_id">Tipo de Documento</label>
              <select class="form-control form-select" formControlName="doc_id" (change)="onDocumentTypeChange()">
                <option [ngValue]="null">Seleccione</option>
                @for (option of documentTypes; track option.value) {
                <option [ngValue]="option.value">{{ option.label }}</option>
                }
              </select>
            </c-col>
            <c-col [md]="3">
              <label for="suc_id">Sucursal</label>
              <select class="form-control form-select" formControlName="suc_id">
                <option [ngValue]="null">Seleccione</option>
                @for (option of sucursales; track option.value) {
                <option [ngValue]="option.value">{{ option.label }}</option>
                }
              </select>
            </c-col>
            <c-col [md]="3">
              <label for="fechaEmision">Fecha de Emisión</label>
              <input formControlName="fechaEmision" type="date" class="form-control" />
            </c-col>
          </c-row>
        </c-card-body>
      </c-card>

      <c-card class="mb-4">
        <c-card-body>
          <c-row>
            <c-col [md]="12">
              <h5>Cliente</h5>
            </c-col>
          </c-row>
          <c-row>
            <c-col [md]="12">
              <label for="cli_id">Buscar Cliente</label>
              <app-search-select
                placeholder="Buscar cliente..."
                bindLabel="cli_nom"
                bindValue="cli_id"
                [serviceFn]="customerSearch"
                (itemSelected)="onSelectCustomer($event)"
              ></app-search-select>
            </c-col>
          </c-row>
        </c-card-body>
      </c-card>

      <c-card class="mb-4">
        <c-card-body>
          <c-row>
            <c-col [md]="12">
              <h5>Agregar Producto</h5>
            </c-col>
          </c-row>
          <c-row>
            <c-col [md]="8">
              <label for="prod_id">Buscar Producto</label>
              <app-search-select
                placeholder="Buscar producto..."
                bindLabel="prod_nom"
                bindValue="prod_id"
                [serviceFn]="productSearch"
                (itemSelected)="onSelectProduct($event)"
              ></app-search-select>
            </c-col>
            <c-col [md]="4" class="mt-4">
              <button
                type="button"
                cButton
                color="primary"
                (click)="addProduct()"
                [disabled]="!selectedProduct"
              >
                <svg cIcon name="cilPlus" class="me-2"></svg>
                Agregar Producto
              </button>
            </c-col>
          </c-row>
        </c-card-body>
      </c-card>

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
                [disabled]="!form.valid"
              >
                <svg cIcon name="cilSave" class="me-2"></svg>
                Guardar Venta
              </button>
            </c-col>
          </c-row>
        </c-card-body>
      </c-card>
    </c-container>
  `,
})
export class NewSalePage extends BaseComponent implements OnInit {
  form!: FormGroup;
  documentTypes: SelectOption[] = [];
  series: SelectOption[] = [];
  sucursales: SelectOption[] = [];
  selectedProduct: any = null;

  #formBuilder = inject(FormBuilder);
  #saleService = inject(SaleService);
  #documentService = inject(DocumentService);
  #customerService = inject(CustomerService);
  #sucursalService = inject(SucursalService);
  #productService = inject(ProductService);
  #globalNotification = inject(GlobalNotification);

  constructor(@Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
    super(MODULES.SALES, viewContainerRef);
  }

  ngOnInit() {
    this.form = this.#formBuilder.group({
      doc_id: [null],
      serie_id: [null],
      suc_id: [null],
      cli_id: [null],
      vendedor_id: [1],
      fechaEmision: [new Date().toISOString().split('T')[0]],
      observaciones: [''],
      detalles: [[]],
    });
    this.loadSelectCombos();
  }

  customerSearch = (term: string) => this.#customerService.getAll();
  productSearch = (term: string) => this.#productService.searchQuick({ term, suc_id: this.form.get('suc_id')?.value });

  loadSelectCombos() {
    this.#documentService.getAll().subscribe({
      next: (response) => {
        this.documentTypes = response.data.map((item) => ({
          value: item.doc_id,
          label: item.doc_nom,
        }));
      },
    });

    this.#sucursalService.getAll().subscribe({
      next: (response) => {
        this.sucursales = response.data.map((item) => ({
          value: item.suc_id,
          label: item.suc_nom,
        }));
      },
    });
  }

  onDocumentTypeChange() {
    const docId = this.form.get('doc_id')?.value;
    if (docId) {
      this.#saleService.getSeriesByDocType(docId).subscribe({
        next: (response) => {
          if (response.isValid) {
            this.series = response.data.map((item: SerieModel) => ({
              value: item.ser_id,
              label: item.ser_num,
            }));
          }
        },
      });
    }
  }

  onSelectCustomer(customer: { cli_id: number }) {
    this.form.patchValue({ cli_id: customer.cli_id });
  }

  onSelectProduct(product: { prod_id: number }) {
    this.selectedProduct = product;
  }

  addProduct() {
    if (!this.selectedProduct) return;
    // Lógica para agregar producto a detalles
    console.log('Producto agregado:', this.selectedProduct);
    this.selectedProduct = null;
  }

  save() {
    if (this.form.invalid) {
      alert('Complete todos los campos requeridos');
      return;
    }

    this.#saleService.create(this.form.value).subscribe({
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
  }
}
