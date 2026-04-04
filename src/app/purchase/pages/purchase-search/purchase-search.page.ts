import { Component, Inject, inject, OnInit, signal, ViewContainerRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  ColComponent,
  FormCheckComponent,
  FormCheckInputDirective,
  FormCheckLabelDirective,
  RowComponent,
  TableDirective,
  TextColorDirective,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { PaginatorComponent } from 'src/app/paginator/paginator.component';
import { PurchaseService } from '../../core/services/purchase.service';
import { MODULES } from 'src/app/core/config/permissions/modules';
import { BaseSearchComponent } from '@shared/base/search-base.component';
import { PageParamsModel } from '@shared/models/query/page-params.model';
import { buildFilterForm, filterSort, mapParams } from '../../helpers';
import { GlobalNotification } from '@shared/alerts/global-notification/global-notification';
import { ConfirmService } from '@shared/confirm-modal/core/services/confirm-modal.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { DateRangePickerComponent } from '@shared/components/date-range-picker/date-range-picker.component';

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
    RouterLink,
    DateRangePickerComponent,
  ],
  templateUrl: './purchase-search.page.html',
  styles: ``,
})
export class PurchaseSearchPage extends BaseSearchComponent implements OnInit {
  public form!: FormGroup;
  title = signal<string>('Historial de Compras');
  readonly #formBuilder = inject(FormBuilder);
  readonly #purchaseService = inject(PurchaseService);
  readonly #confirmService = inject(ConfirmService);
  readonly #globalNotification = inject(GlobalNotification);
  public purchases: any[] = [];

  availableStates = [
    { id: 2, nombre: 'Pagados', color: 'success' },
    { id: 1, nombre: 'Pendientes', color: 'warning' },
    { id: 3, nombre: 'Anulados', color: 'danger' },
  ];

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

  toggleEstado(id: number) {
    const currentEstados = this.form.get('estados')?.value || [];
    const index = currentEstados.indexOf(id);
    if (index > -1) {
      currentEstados.splice(index, 1);
    } else {
      currentEstados.push(id);
    }
    this.form.get('estados')?.setValue([...currentEstados]);
  }

  isEstadoChecked(id: number): boolean {
    return (this.form.get('estados')?.value || []).includes(id);
  }

  onSearch(filter = null, page = 1) {
    const sort = filterSort(this.form.value);
    const filterToUse = filter ?? mapParams(this.form.value);
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
      estados: ['COMP'], // Or whatever default was intended
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

  onPrint(id: number) {
    this.#purchaseService.print(id).subscribe({
      next: (response) => {
        const blob = response.body as Blob;
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        this.#globalNotification.openAlert(error.error);
      },
    });
  }

  onDateRangeChange(range: { start: Date | null; end: Date | null }) {
    const formatDateForApi = (date: Date | null): string => {
      if (!date) return '';
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    this.form.patchValue({
      fecha_inicio: range.start ? formatDateForApi(range.start) : null,
      fecha_fin: range.end ? formatDateForApi(range.end) : null,
    });
  }
}
