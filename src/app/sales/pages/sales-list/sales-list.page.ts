import { Component, inject, Inject, ViewContainerRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  ColComponent,
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
import { SaleService } from '../../core/services/sale.service';
import { SaleModel } from '../../core/models/sale.model';

@Component({
  selector: 'app-sales-list',
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
    DatePipe,
    CurrencyPipe,
    TextColorDirective,
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
            <label for="fecha_inicio" class="form-label">Rango de Fechas</label>
            <input formControlName="fecha_inicio" type="date" class="form-control" id="fecha_inicio" />
          </c-col>
          <c-col sm="12" md="6" lg="2">
            <label for="fecha_fin" class="form-label">&nbsp;</label>
            <input formControlName="fecha_fin" type="date" class="form-control" id="fecha_fin" />
          </c-col>
          <c-col sm="12" md="6" lg="2">
            <label for="search" class="form-label">Filtro General</label>
            <input
              formControlName="search"
              type="text"
              class="form-control"
              id="search"
              placeholder="Buscar..."
            />
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
            <table cTable striped="true">
              <thead>
                <tr>
                  <th>Acciones</th>
                  <th>Nro. Documento</th>
                  <th>Tipo</th>
                  <th>Fecha Emisión</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                @for (sale of sales; track sale.venta_id) {
                <tr>
                  <td>
                    <button size="sm" class="me-2" cButton color="secondary">
                      <svg cIcon name="cilPrint"></svg>
                    </button>
                    <button (click)="onDelete(sale.venta_id)" size="sm" cButton color="danger">
                      <svg cIcon name="cilTrash"></svg>
                    </button>
                  </td>
                  <td>{{ sale.numero_completo }}</td>
                  <td>{{ sale.documento?.doc_nom }}</td>
                  <td>{{ sale.fechaEmision | date: 'dd/MM/yyyy' }}</td>
                  <td>{{ sale.cliente?.cli_nom }}</td>
                  <td>{{ sale.venta_total | currency: 'S/. ' }}</td>
                  <td>
                    <span
                      class="badge"
                      [class.bg-success]="sale.est"
                      [class.bg-danger]="!sale.est"
                    >
                      {{ sale.est ? 'Activo' : 'Anulado' }}
                    </span>
                  </td>
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
export class SalesListPage extends BaseSearchComponent {
  title = 'Historial de Ventas';
  sales: SaleModel[] = [];
  form = inject(FormBuilder).group({
    fecha_inicio: [null],
    fecha_fin: [null],
    search: [''],
  });

  #saleService = inject(SaleService);
  #confirmService = inject(ConfirmService);
  #globalNotification = inject(GlobalNotification);

  constructor(@Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
    super(MODULES.SALES, viewContainerRef);
  }

  ngOnInit(): void {
    this.onSearch();
  }

  onSearch(page = 1) {
    const pageSize = 10;
    const pageParams = new PageParamsModel(page, pageSize);
    this.updatePage(pageParams);

    this.#saleService.search(pageParams).subscribe({
      next: (response) => {
        if (response.isValid) {
          this.total = response.data.total;
          this.sales = response.data.items;
        }
      },
      error: (error) => {
        this.#globalNotification.openToastAlert('Error', error.messages, 'danger');
      },
    });
  }

  onPageChange(page: number): void {
    this.onSearch(page);
  }

  onClean() {
    this.form.reset();
    this.onSearch();
  }

  onDelete(id: number) {
    this.#confirmService
      .open({
        title: 'Anular Venta',
        message: '¿Estás seguro de anular esta venta?',
        color: 'danger',
        confirmText: 'Si, anular',
        cancelText: 'Cancelar',
      })
      .then((confirmed) => {
        if (confirmed) {
          this.#saleService.delete(id).subscribe({
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
}
