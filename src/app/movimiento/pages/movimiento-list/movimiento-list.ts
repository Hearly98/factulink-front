import { Component, Inject, inject, OnInit, ViewContainerRef } from '@angular/core';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  ColComponent,
  RowComponent,
  TableDirective,
  FormSelectDirective,
  FormControlDirective,
  FormLabelDirective,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BaseSearchComponent } from '../../../shared/base/search-base.component';
import { MODULES } from '../../../core/config/permissions/modules';
import { PageParamsModel } from '../../../shared/models/query/page-params.model';
import { MovimientoService } from '../../core/services/movimiento.service';
import { GetMovimientoModel } from '../../core/models/movimiento.model';
import { PaginatorComponent } from '../../../paginator/paginator.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AlmacenService } from '../../../almacen/core/services/almacen.service';
import { GetAlmacenModel } from '../../../almacen/core/models';
import { GlobalNotification } from '@shared/alerts/global-notification/global-notification';
import { buildMovimientoFilterForm } from '../../helpers';
import { TypedFormGroup } from '@shared/types/types-form';
import { MovimientoFilterForm } from '../../core/types/movimiento-filter-form';

@Component({
  selector: 'app-movimiento-list',
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
    FormSelectDirective,
    FormLabelDirective,
    FormControlDirective,
    RouterModule,
  ],
  templateUrl: './movimiento-list.html',
})
export class MovimientoListComponent extends BaseSearchComponent implements OnInit {
  public movimientos: GetMovimientoModel[] = [] as GetMovimientoModel[];
  public almacenes: GetAlmacenModel[] = [] as GetAlmacenModel[];
  public title = 'Historial de Movimientos';
  public filterForm!: TypedFormGroup<MovimientoFilterForm>;
  readonly #formBuilder = inject(FormBuilder);
  readonly #movimientoService = inject(MovimientoService);
  readonly #almacenService = inject(AlmacenService);
  readonly #globalNotification = inject(GlobalNotification);

  constructor(@Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
    super(MODULES.MOVIMIENTO, viewContainerRef);
  }

  ngOnInit(): void {
    this.createForm();
    this.loadAlmacenes();
    this.onSearch();
  }

  createForm() {
    this.filterForm = this.#formBuilder.group(buildMovimientoFilterForm());
  }

  loadAlmacenes() {
    this.#almacenService.getAll().subscribe((res: any) => {
      if (res.isValid && Array.isArray(res.data)) {
        this.almacenes = res.data;
      }
    });
  }

  onSearch(filter = null, page = 1) {
    const formValue = this.filterForm.value;
    const pageSize = 10;
    const pageParams = new PageParamsModel(page, pageSize);

    const filterToUse = { ...formValue };
    const sort = [{ property: 'mov_fecha', direction: 'desc' }];

    this.updateFilter(filterToUse);
    this.updateSort(sort);
    this.updatePage(pageParams);
    const params = this.getPageParams();

    const subscription = this.#movimientoService.search(params).subscribe({
      next: (response) => {
        if (response.isValid) {
          this.total = response.data.total ?? 0;
          this.movimientos = response.data.items;
        } else {
          this.#globalNotification.openAlert(response);
        }
      },
      error: (err) => this.#globalNotification.openAlert(err.error),
    });
    this.subscriptions.push(subscription);
  }

  onPageChange(pageValue: number): void {
    this.onSearch(null, pageValue);
  }

  onClean() {
    this.filterForm.reset();
    this.onSearch();
  }
}
