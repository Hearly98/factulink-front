import { Component, inject, Inject, ViewContainerRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  ColComponent,
  FormCheckComponent,
  FormCheckInputDirective,
  FormCheckLabelDirective,
  FormSelectDirective,
  RowComponent,
  TableDirective,
  TextColorDirective,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { BaseSearchComponent } from '@shared/base/search-base.component';
import { MODULES } from 'src/app/core/config/permissions/modules';
import { PageParamsModel } from '@shared/models/query/page-params.model';
import { PaginatorComponent } from 'src/app/paginator/paginator.component';
import { ConfirmService } from '@shared/confirm-modal/core/services/confirm-modal.service';
import { GlobalNotification } from '@shared/alerts/global-notification/global-notification';
import { QuotationService } from '../core/services/quotation.service';
import { QuotationModel } from '../core/models/quotation.model';
import { Router } from '@angular/router';
import { TypedFormGroup } from '@shared/types/types-form';
import { QuotationFilterForm } from '../core/types';
import { buildFilterForm, filterSort, mapParams } from '../helpers';
import { SucursalService } from 'src/app/sucursal/core/services/sucursal.service';
import { GetSucursalModel } from 'src/app/sucursal/core/models';

@Component({
  selector: 'app-quotation-list',
  standalone: true,
  imports: [
    CommonModule,
    RowComponent,
    ColComponent,
    CardComponent,
    CardBodyComponent,
    IconDirective,
    ButtonDirective,
    TableDirective,
    ReactiveFormsModule,
    PaginatorComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormSelectDirective,
    TextColorDirective,
    DatePipe,
    CurrencyPipe,
  ],
  template: `
    <c-row>
      <c-col>
        <h4>{{ title }}</h4>
      </c-col>
    </c-row>

    <c-card class="mt-3">
      <c-card-body>
        <c-row class="g-3 align-items-end" [formGroup]="form">
          <c-col sm="12" md="6" lg="2">
            <label for="fecha_desde" class="form-label">Desde</label>
            <input
              formControlName="fecha_desde"
              type="date"
              class="form-control"
              id="fecha_desde"
            />
          </c-col>
          <c-col sm="12" md="6" lg="2">
            <label for="fecha_hasta" class="form-label">Hasta</label>
            <input formControlName="fecha_hasta" type="date" class="form-control" id="fecha_hasta" />
          </c-col>
          <c-col sm="12" md="6" lg="2">
            <label for="suc_id" class="form-label">Sucursal</label>
            <select cSelect formControlName="suc_id" id="suc_id">
              <option [value]="null">Todas</option>
              @for (sucursal of sucursales; track sucursal.suc_id) {
                <option [value]="sucursal.suc_id">{{ sucursal.suc_nom }}</option>
              }
            </select>
          </c-col>
          <c-col sm="12" md="6" lg="2">
            <label for="nombre" class="form-label">Filtro General</label>
            <input
              formControlName="nombre"
              type="text"
              class="form-control"
              id="nombre"
              placeholder="Número o cliente..."
            />
          </c-col>
          <c-col sm="12" md="6" lg="4">
            <label class="form-label">Filtro de Estados</label>
            <div class="form-control fs-7">
              <div class="d-flex gap-3 align-items-center">
                @for (state of availableStates; track state.codigo) {
                  <c-form-check>
                    <input
                      cFormCheckInput
                      type="checkbox"
                      [checked]="isEstadoChecked(state.codigo)"
                      (change)="toggleEstado(state.codigo)"
                      [id]="'state_' + state.codigo"
                    />
                    <label cFormCheckLabel [for]="'state_' + state.codigo" [cTextColor]="state.color">
                      {{ state.nombre }}
                    </label>
                  </c-form-check>
                }
              </div>
            </div>
          </c-col>
          <c-col sm="12" md="6" lg="3">
            <button cButton color="primary" (click)="onSearch()" class="me-2">
              <svg cIcon name="cilSearch"></svg>
              Buscar
            </button>
            <button cButton color="danger" (click)="onClean()">
              <svg cIcon name="cilTrash"></svg>
              Limpiar
            </button>
          </c-col>
        </c-row>
      </c-card-body>
    </c-card>

    <c-card class="mt-3">
      <c-card-body>
        <c-row>
          <c-col sm="12">
            <table cTable [responsive]="true" striped="true">
              <thead>
                <tr>
                  <th>Acciones</th>
                  <th>Nro.</th>
                  <th>Fecha Emisión</th>
                  <th>Cliente</th>
                  <th>Precio Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                @if(quotations.length > 0){
                  @for (quotation of quotations; track quotation.cot_id) {
                    <tr>
                      <td>
                        @if(quotation.estado_cotizacion?.codigo !== '03'){
                          <button size="sm" class="me-2" cButton color="secondary" (click)="onPrint(quotation.cot_id, quotation.numero_completo)">
                            <svg cIcon name="cilPrint"></svg>
                          </button>
                        }
                        @if(quotation.estado_cotizacion?.codigo !== '03'){
                          <button size="sm" class="me-2" cButton color="info" (click)="onEdit(quotation.cot_id)">
                            <svg cIcon name="cilPencil"></svg>
                          </button>
                        }
                        @if(quotation.estado_cotizacion?.codigo !== '03'){
                          <button (click)="onDelete(quotation.cot_id)" size="sm" cButton color="danger">
                            <svg cIcon name="cilTrash"></svg>
                          </button>
                        }
                      </td>
                      <td>{{ quotation.numero_completo }}</td>
                      <td>{{ quotation.fecha_emision | date: 'dd/MM/yyyy' }}</td>
                      <td>{{ quotation.cliente?.cli_nom }}</td>
                      <td>{{ quotation.cot_total | currency: 'S/. ' }}</td>
                      <td>
                        <span class="badge" [class.bg-warning]="quotation.estado_cotizacion?.color === 'warning'" [class.bg-success]="quotation.estado_cotizacion?.color === 'success'" [class.bg-danger]="quotation.estado_cotizacion?.color === 'danger'">
                          {{ quotation.estado_cotizacion?.nombre }}
                        </span>
                      </td>
                    </tr>
                  }
                } @else {
                  <tr>
                    <td colspan="6">No hay datos</td>
                  </tr>
                }
              </tbody>
            </table>
            <app-paginator
              [(page)]="page.page"
              [pageSize]="page.pageSize"
              [total]="total"
              (pageChange)="onPageChange($event)"
            ></app-paginator>
          </c-col>
        </c-row>
      </c-card-body>
    </c-card>
  `,
})
export class QuotationListPage extends BaseSearchComponent implements OnInit {
  title = 'Cotizaciones';
  quotations: QuotationModel[] = [];
  form!: FormGroup;
  sucursales: GetSucursalModel[] = [];

  availableStates = [
    { codigo: '01', nombre: 'Pendientes', color: 'warning' },
    { codigo: '02', nombre: 'Aprobados', color: 'success' },
    { codigo: '03', nombre: 'Anulados', color: 'danger' },
  ];

  #router = inject(Router);
  #formBuilder = inject(FormBuilder);
  #quotationService = inject(QuotationService);
  #sucursalService = inject(SucursalService);
  #confirmService = inject(ConfirmService);
  #globalNotification = inject(GlobalNotification);

  constructor(@Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
    super(MODULES.SALES, viewContainerRef);
  }

  ngOnInit(): void {
    this.form = this.#formBuilder.group(buildFilterForm());
    this.loadSucursales();
    this.onSearch();
  }

  loadSucursales() {
    this.#sucursalService.getAll().subscribe({
      next: (response) => {
        if (response.isValid) {
          this.sucursales = response.data;
        }
      },
    });
  }

  toggleEstado(codigo: string) {
    const currentEstados = this.form.get('estados')?.value || [];
    const index = currentEstados.indexOf(codigo);
    if (index > -1) {
      currentEstados.splice(index, 1);
    } else {
      currentEstados.push(codigo);
    }
    this.form.get('estados')?.setValue([...currentEstados]);
  }

  isEstadoChecked(codigo: string): boolean {
    return (this.form.get('estados')?.value || []).includes(codigo);
  }

  onSearch(filter = null, page = 1) {
    const sort = filterSort(this.form.value);
    const filterToUse = filter || mapParams(this.form.value);
    const pageSize = 10;
    const pageParams = new PageParamsModel(page, pageSize);

    this.updateFilter(filterToUse);
    this.updateSort(sort);
    this.updatePage(pageParams);

    const params = this.getPageParams();

    this.#quotationService.search(params).subscribe({
      next: (response) => {
        if (response.isValid) {
          this.total = response.data.total;
          this.quotations = response.data.items;
        }
      },
      error: (error) => {
        this.#globalNotification.openToastAlert('Error', error.messages, 'danger');
      },
    });
  }

  onPageChange(page: number): void {
    this.onSearch(this.filter, page);
  }

  onClean() {
    this.form.reset();
    this.form.patchValue({
      order: 'desc',
      estados: ['02'],
      suc_id: null,
    });
    this.onSearch();
  }

  onDelete(id: number) {
    this.#confirmService
      .open({
        title: 'Eliminar',
        message: '¿Estás seguro de anular esta cotización?',
        color: 'danger',
        confirmText: 'Si, anular',
        cancelText: 'Cancelar',
      })
      .then((confirmed) => {
        if (confirmed) {
          this.#quotationService.anular(id).subscribe({
            next: (response) => {
              if (response.isValid) {
                this.#globalNotification.openAlert(response);
                this.onSearch();
              } else {
                this.#globalNotification.openAlert(response);
              }
            },
            error: (error) => {
              this.#globalNotification.openToastAlert('Error', error.messages, 'danger');
            },
          });
        }
      });
  }

  onPrint(id: number, number_serie: string) {
    this.#quotationService.print(id).subscribe({
      next: (response) => {
        const blob = response.body as Blob;
        const contentDisposition = response.headers.get('content-disposition');
        let filename = `${number_serie}.pdf`;

        if (contentDisposition) {
          const match = contentDisposition.match(/filename="?([^";\\n]*)"?/);
          if (match && match[1]) {
            filename = match[1];
          }
        }

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        this.#globalNotification.openToastAlert(
          'Error',
          error.message,
          'danger'
        );
      }
    });
  }

  onEdit(id: number) {
    this.#router.navigate(['/editar-cotizacion', id]);
  }
}
