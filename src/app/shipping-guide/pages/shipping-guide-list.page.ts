import { Component, inject, Inject, ViewContainerRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  ColComponent,
  RowComponent,
  TableDirective,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { BaseSearchComponent } from '@shared/base/search-base.component';
import { MODULES } from 'src/app/core/config/permissions/modules';
import { PageParamsModel } from '@shared/models/query/page-params.model';
import { PaginatorComponent } from 'src/app/paginator/paginator.component';
import { ConfirmService } from '@shared/confirm-modal/core/services/confirm-modal.service';
import { GlobalNotification } from '@shared/alerts/global-notification/global-notification';
import { ShippingGuideService } from '../core/services/shipping-guide.service';
import { ShippingGuideModel } from '../core/models/shipping-guide.model';

@Component({
  selector: 'app-shipping-guide-list',
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
  ],
  template: `
    <c-row>
      <c-col>
        <h4>{{ title }}</h4>
      </c-col>
    </c-row>

    <c-card class="mt-3">
      <c-card-body>
        <c-row class="mb-3">
          <c-col>
            <button cButton color="primary">
              <svg cIcon name="cilPlus"></svg>
              Nueva Guía de Remisión
            </button>
          </c-col>
        </c-row>
        <c-row>
          <c-col sm="12">
            <table cTable [responsive]="true" striped="true">
              <thead>
                <tr>
                  <th>Acciones</th>
                  <th>Nro. Guía</th>
                  <th>Fecha Emisión</th>
                  <th>Tipo Traslado</th>
                  <th>Destinatario</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                @for (guide of guides; track guide.guia_id) {
                <tr>
                  <td>
                    <button size="sm" class="me-2" cButton color="secondary">
                      <svg cIcon name="cilPrint"></svg>
                    </button>
                    <button (click)="onDelete(guide.guia_id)" size="sm" cButton color="danger">
                      <svg cIcon name="cilTrash"></svg>
                    </button>
                  </td>
                  <td>{{ guide.numero_completo }}</td>
                  <td>{{ guide.fecha_emision | date: 'dd/MM/yyyy' }}</td>
                  <td>{{ guide.tipo_traslado }}</td>
                  <td>{{ guide.destinatario_nombre }}</td>
                  <td>
                    <span class="badge" [class.bg-success]="guide.est" [class.bg-danger]="!guide.est">
                      {{ guide.est ? 'Activo' : 'Anulado' }}
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
export class ShippingGuideListPage extends BaseSearchComponent {
  title = 'Guías de Remisión';
  guides: ShippingGuideModel[] = [];

  #shippingGuideService = inject(ShippingGuideService);
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

    this.#shippingGuideService.search(pageParams).subscribe({
      next: (response: any) => {
        if (response.isValid) {
          this.total = response.data.total;
          this.guides = response.data.items;
        }
      },
      error: (error: any) => {
        this.#globalNotification.openToastAlert('Error', error.messages, 'danger');
      },
    });
  }

  onPageChange(page: number): void {
    this.onSearch(page);
  }

  onDelete(id: number) {
    this.#confirmService
      .open({
        title: 'Eliminar',
        message: '¿Estás seguro de eliminar esta guía de remisión?',
        color: 'danger',
        confirmText: 'Si, eliminar',
        cancelText: 'Cancelar',
      })
      .then((confirmed: any) => {
        if (confirmed) {
          this.#shippingGuideService.delete(id).subscribe({
            next: (response: any) => {
              if (response.isValid) {
                this.#globalNotification.openAlert(response);
                this.onSearch();
              } else {
                this.#globalNotification.openAlert(response);
              }
            },
            error: (error: any) => {
              this.#globalNotification.openToastAlert('Error', error.messages, 'danger');
            },
          });
        }
      });
  }
}
