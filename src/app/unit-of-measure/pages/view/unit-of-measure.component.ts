import { Component, Inject, inject, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { TypedFormGroup } from '@shared/types/types-form';
import { SucursalService } from 'src/app/sucursal/core/services/sucursal.service';
import { UnitOfMeasureService } from '../../core/services/unit-of-measure.service';
import { GetUnitOfMeasureModel } from '../../core/models';
import { GetSucursalModel } from 'src/app/sucursal/core/models';
import { MODULES } from 'src/app/core/config/permissions/modules';
import { BaseSearchComponent } from '@shared/base/search-base.component';
import { buildFilterForm, filterSort, mapParams } from '../../helpers';
import { FilterForm } from '../../core/types';
import { PageParamsModel } from '@shared/models/query/page-params.model';
import { UnitOfMeasureNewEditModalComponent } from '../../components/unit-of-measure-new-edit/unit-of-measure-new-edit-modal.component';
import { CommonModule } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import {
  ButtonModule,
  CardBodyComponent,
  CardComponent,
  ColComponent,
  RowComponent,
  TableDirective,
} from '@coreui/angular';
import { PaginatorComponent } from 'src/app/paginator/paginator.component';

@Component({
  selector: 'app-unit-of-measure',
  imports: [
    CommonModule,
    IconDirective,
    ButtonModule,
    RowComponent,
    ColComponent,
    CardComponent,
    CardBodyComponent,
    ReactiveFormsModule,
    PaginatorComponent,
    TableDirective,
    UnitOfMeasureNewEditModalComponent,
  ],
  template: `
    <c-row>
      <c-col>
        <h4>{{ title }}</h4>
      </c-col>
      <c-col class="text-end">
        <button cButton color="primary" (click)="openModal()">
          <svg cIcon name="cilPlus"></svg>
          Nuevo Registro
        </button>
      </c-col>
    </c-row>

    <c-row class="mt-4">
      <c-col>
        <c-card>
          <c-card-body>
            <c-row class="g-3 align-items-end" [formGroup]="form">
              <c-col sm="12" md="3" lg="3">
                <label for="">Nombre</label>
                <input formControlName="und_nom" type="text" class="form-control" />
              </c-col>
              <c-col sm="12" md="3" lg="3">
                <label for="">Sucursal</label>
                <select formControlName="suc_id" class="form-control form-select">
                  <option [ngValue]="null">Todas</option>
                  @for(sucursal of sucursales; track $index){
                  <option [ngValue]="sucursal.suc_id">{{ sucursal.suc_nom }}</option>
                  }
                </select>
              </c-col>
              <c-col>
                <button cButton color="primary" (click)="onSearch()" class="me-2">
                  <svg cIcon name="cilSearch"></svg>
                  Buscar
                </button>
                <button cButton color="danger" (click)="onClean()">
                  <svg cIcon name="cilTrash"></svg>
                  Limpiar
                </button>
              </c-col>
              <c-col sm="12" md="12" lg="12">
                <table cTable striped="true">
                  <thead>
                    <tr>
                      <th>Acciones</th>
                      <th>Nombre</th>
                      <th>Sucursal</th>
                    </tr>
                  </thead>
                  <tbody>
                    @if(units.length > 0){ @for (unit of units; track $index) {
                    <tr>
                      <td>
                        <button
                          (click)="openModal(unit.und_id)"
                          size="sm"
                          class="me-2"
                          cButton
                          color="info"
                        >
                          <svg cIcon name="cilPencil"></svg>
                        </button>
                        <button size="sm" cButton color="danger">
                          <svg cIcon name="cilTrash"></svg>
                        </button>
                      </td>
                      <td>{{ unit.und_nom }}</td>
                      <td>{{ unit.suc_id }}</td>
                    </tr>
                    }}@else{
                    <tr>
                      <td colspan="3">No hay datos</td>
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
      </c-col>
    </c-row>
    <app-unit-of-measure-new-edit-modal
      #unitOfMeasureNewEditModal
    ></app-unit-of-measure-new-edit-modal>
  `,
  styles: ``,
})
export class UnitOfMeasurePage extends BaseSearchComponent {
  @ViewChild('unitOfMeasureNewEditModal')
  unitOfMeasureNewEditModal!: UnitOfMeasureNewEditModalComponent;
  public form!: TypedFormGroup<FilterForm>;
  #formBuilder = inject(FormBuilder);
  public title = 'Unidad Medida';
  #unitOfMeasureService = inject(UnitOfMeasureService);
  #sucursalService = inject(SucursalService);
  public units: GetUnitOfMeasureModel[] = [];
  public sucursales: GetSucursalModel[] = [];

  constructor(@Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
    super(MODULES.UNIT_OF_MEASURE, viewContainerRef);
  }

  ngOnInit(): void {
    this.createForm();
    this.loadSelectCombos();
    this.onSearch();
  }

  createForm() {
    this.form = this.#formBuilder.group(buildFilterForm());
  }

  loadSelectCombos() {
    this.fetchData(this.#sucursalService.getAll(), this.sucursales);
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
    const subscription = this.#unitOfMeasureService.search(params).subscribe({
      next: (response) => {
        if (response.isValid) {
          this.total = response.data.total;
          this.units = response.data.items;
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
  }

  openModal(id?: number) {
    if (this.unitOfMeasureNewEditModal) {
      this.unitOfMeasureNewEditModal.openModal(id, () => {
        this.onSearch();
      });
    }
  }
}
