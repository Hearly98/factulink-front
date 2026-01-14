import { Component, Inject, inject, signal, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ButtonDirective, CardBodyComponent, CardComponent, ColComponent, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, RowComponent, TableDirective, TextColorDirective } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { PaginatorComponent } from 'src/app/paginator/paginator.component';
import { TypedFormGroup } from '@shared/types/types-form';
import { PurchaseService } from '../../core/services/purchase.service';
import { MODULES } from 'src/app/core/config/permissions/modules';
import { BaseSearchComponent } from '@shared/base/search-base.component';
import { PageParamsModel } from '@shared/models/query/page-params.model';
import { PurchaseFilterForm } from '../../core/types/purchase-filter.form';
import { buildFilterForm, filterSort, mapParams } from '../../helpers';
import { GlobalNotification } from '@shared/alerts/global-notification/global-notification';
import { ConfirmService } from '@shared/confirm-modal/core/services/confirm-modal.service';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-purchase-search',
  imports: [
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
    DatePipe,
    CurrencyPipe,
    TextColorDirective,
    RouterLink
  ],
  template: `<c-row>
      <c-col>
        <h4>{{ title() }}</h4>
      </c-col>
    </c-row>

    <c-card class="mt-3">
      <c-card-body>
        <c-row class="g-3 align-items-end" [formGroup]="form">
          <c-col sm="12" md="6" lg="2">
            <label for="fecha_inicio" class="form-label">Rango de Fechas</label>
            <input
              formControlName="fecha_inicio"
              type="date"
              class="form-control"
              id="fecha_inicio"
            />
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
            <label class="form-label">Filtro de Estados</label>
            <div  class="form-control fs-7">
            <div class="d-flex gap-3 align-items-center">
              <c-form-check>
                <input
                  cFormCheckInput
                  type="checkbox"
                  formControlName="estado_cancelado"
                  id="estado_cancelado"
                />
                <label cFormCheckLabel for="estado_cancelado" cTextColor="success">Cancelados</label>
              </c-form-check>
              <c-form-check>
                <input
                  cFormCheckInput
                  type="checkbox"
                  formControlName="estado_pendiente"
                  id="estado_pendiente"
                />
                <label cFormCheckLabel for="estado_pendiente" cTextColor="warning">Pendientes</label>
              </c-form-check>
              <c-form-check>
                <input
                  cFormCheckInput
                  type="checkbox"
                  formControlName="estado_eliminado"
                  id="estado_eliminado"
                />
                <label cFormCheckLabel for="estado_eliminado" cTextColor="danger">Eliminados</label>
              </c-form-check>
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
          <c-col sm="12" md="12" lg="12">
            <table cTable striped="true">
              <thead>
                <tr>
                  <th>Acciones</th>
                  <th>Nro.</th>
                  <th>Tipo</th>
                  <th>Fecha Emisión</th>
                  <th>Proveedor</th>
                  <th>Precio Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                @for (purchase of purchases; track $index) {
                <tr>
                  <td>
                      <button
                      size="sm"
                      class="me-2"
                      cButton
                      color="secondary"
                    >
                      <svg cIcon name="cilPrint"></svg>
                    </button>
                    <button
                      [routerLink]="'/ver-compra/'+ purchase.compr_id"
                      size="sm"
                      class="me-2"
                      cButton
                      color="info"
                    >
                      <svg cIcon name="cilPencil"></svg>
                    </button>
                    <button (click)="onDelete(purchase.compr_id)" size="sm" cButton color="danger">
                      <svg cIcon name="cilTrash"></svg>
                    </button>
                  </td>
                  <td>{{purchase.numero}}</td>
                  <td>{{purchase.documento.doc_nom}}</td>
                  <td>{{ purchase.fechaEmision | date: 'dd/MM/yyyy' }}</td>
                  <td>{{ purchase.proveedor.prov_nom }}</td>
                  <td>{{ purchase.compr_total | currency: 'S/. ' }}</td>
                  <td>
                    <span
                      class="badge"
                      [class.bg-warning]="purchase.estado.estado_cod === 'PEND'"
                      [class.bg-success]="purchase.estado.estado_cod === 'COMP'"
                      [class.bg-danger]="purchase.estado.estado_cod === 'eliminado'"
                    >
                      {{ purchase.estado.estado_nom }}
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
    </c-card>`,
  styles: ``,
})
export class PurchaseSearchPage extends BaseSearchComponent {
  public form!: TypedFormGroup<PurchaseFilterForm>;
  #formBuilder = inject(FormBuilder);
  title = signal<string>('Historial de Compras');
  #purchaseService = inject(PurchaseService);
  #confirmService = inject(ConfirmService);
  #globalNotification = inject(GlobalNotification);
  public purchases: any[] = [];

  constructor(@Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
    super(MODULES.PURCHASE, viewContainerRef);
  }

  ngOnInit(): void {
    this.createForm();
    this.onSearch();
  }

  createForm() {
    this.form = this.#formBuilder.group(buildFilterForm());
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
    const subscription = this.#purchaseService.search(params).subscribe({
      next: (response) => {
        if (response.isValid) {
          this.total = response.data.total;
          this.purchases = response.data.items;
        } else {
          console.error(response);
        }
      },
      error: (response) => {
        console.error(response.messages);
      },
    });
    this.subscriptions.push(subscription);
  }

  onPageChange(page: number): void {
    this.onSearch(this.filter, page);
  }

  onClean() {
    this.form.reset();
    this.form.patchValue({
      order: 'desc',
      estado_cancelado: false,
      estado_pendiente: false,
      estado_eliminado: false,
    });
    this.onSearch();
  }

  onDelete(id: number) {
    this.#confirmService
      .open({
        title: 'Eliminar',
        message: '¿Estás seguro de eliminar este registro?',
        color: 'danger',
        confirmText: 'Si, eliminar',
        cancelText: 'Cancelar',
      })
      .then((confirmed) => {
        if (confirmed) {
          this.#purchaseService.delete(id).subscribe({
            next: (response) => {
              if (response.isValid) {
                this.#globalNotification.openAlert(response);
                this.onSearch();
              } else {
                this.#globalNotification.openAlert(response);
              }
            },
            error: (response) => {
              this.#globalNotification.openToastAlert('Error al eliminar', response, 'danger');
            },
          });
        }
      });
  }
}
