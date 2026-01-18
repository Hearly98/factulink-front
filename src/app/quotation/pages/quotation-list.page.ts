import { Component, inject, Inject, ViewContainerRef } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
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
import { QuotationService } from '../core/services/quotation.service';
import { QuotationModel } from '../core/models/quotation.model';

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
        <c-row>
          <c-col sm="12">
            <table cTable striped="true">
              <thead>
                <tr>
                  <th>Acciones</th>
                  <th>Nro. Cotización</th>
                  <th>Fecha</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
              @if(quotations.length > 0){
  @for (quotation of quotations; track quotation.cot_id) {
                <tr>
                  <td>
                    <button size="sm" class="me-2" cButton color="secondary" (click)="onPrint(quotation.cot_id)">
                      <svg cIcon name="cilPrint"></svg>
                    </button>
                    <button size="sm" class="me-2" cButton color="info">
                      <svg cIcon name="cilPencil"></svg>
                    </button>
                    <button (click)="onDelete(quotation.cot_id)" size="sm" cButton color="danger">
                      <svg cIcon name="cilTrash"></svg>
                    </button>
                  </td>
                  <td>{{ quotation.numero_completo }}</td>
                  <td>{{ quotation.fecha_emision | date: 'dd/MM/yyyy' }}</td>
                  <td>{{ quotation.cliente?.cli_nom }}</td>
                  <td>{{ quotation.cot_total | currency: 'S/. ' }}</td>
                  <td>
                    <span class="badge" [class.bg-success]="quotation.est" [class.bg-danger]="!quotation.est">
                      {{ quotation.est ? 'Activo' : 'Anulado' }}
                    </span>
                  </td>
                </tr>
                }
              }@else{
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
export class QuotationListPage extends BaseSearchComponent {
  title = 'Cotizaciones';
  quotations: QuotationModel[] = [];

  #quotationService = inject(QuotationService);
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

    this.#quotationService.search(pageParams).subscribe({
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
    this.onSearch(page);
  }

  onDelete(id: number) {
    this.#confirmService
      .open({
        title: 'Eliminar',
        message: '¿Estás seguro de eliminar esta cotización?',
        color: 'danger',
        confirmText: 'Si, eliminar',
        cancelText: 'Cancelar',
      })
      .then((confirmed) => {
        if (confirmed) {
          this.#quotationService.delete(id).subscribe({
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

  onPrint(id: number) {
    this.#quotationService.print(id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cotizacion-${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        this.#globalNotification.openToastAlert('Error', error.message, 'danger');
      }
    });
  }

}
