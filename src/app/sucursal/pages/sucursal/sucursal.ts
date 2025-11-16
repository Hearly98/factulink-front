import { Component, Inject, inject, ViewChild, ViewContainerRef } from '@angular/core';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  ColComponent,
  RowComponent,
  TableDirective,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { SucursalService } from '../../core/services/sucursal.service';
import { TypedFormGroup } from '../../../shared/types/types-form';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { buildFilterForm, filterSort, mapParams } from '../../helpers';
import { BaseSearchComponent } from '../../../shared/base/search-base.component';
import { MODULES } from '../../../core/config/permissions/modules';
import { PageParamsModel } from '../../../shared/models/query/page-params.model';
import { SucursalNewEditModal } from '../../components/sucursal-new-edit-modal/sucursal-new-edit-modal';
import { FilterForm } from '../../core/types';
import { GetSucursalModel } from '../../core/models';
import { PaginatorComponent } from "../../../paginator/paginator.component";

@Component({
  selector: 'app-category',
  imports: [
    RowComponent,
    ColComponent,
    CardComponent,
    CardBodyComponent,
    IconDirective,
    ButtonDirective,
    TableDirective,
    ReactiveFormsModule,
    SucursalNewEditModal,
    PaginatorComponent
],
  templateUrl: './sucursal.html',
  styleUrl: './sucursal.scss',
})
export class Sucursal extends BaseSearchComponent {
  @ViewChild('sucursalNewEditModal') sucursalNewEditModal!: SucursalNewEditModal;
  public form!: TypedFormGroup<FilterForm>;
  #formBuilder = inject(FormBuilder);
  public title = 'Sucursales';
  #sucursalService = inject(SucursalService);
  public sucursals: GetSucursalModel[] = [];

  constructor(@Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
    super(MODULES.SUCURSAL, viewContainerRef);
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
    const subscription = this.#sucursalService.search(params).subscribe({
      next: (response) => {
        if (response.isValid) {
          this.total = response.data.total;
          this.sucursals = response.data.items;
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
    if (this.sucursalNewEditModal) {
      this.sucursalNewEditModal.openModal(id, () => {
        this.onSearch();
      });
    }
  }
}
