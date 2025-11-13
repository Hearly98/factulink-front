import { Component, Inject, inject, ViewChild, ViewContainerRef } from '@angular/core';
import { ButtonDirective, CardBodyComponent, CardComponent, ColComponent, RowComponent, TableDirective, ThemeDirective } from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { CategoryService } from '../../core/services/category.service';
import { CategoryModel } from '../../core/models/category.model';
import { TypedFormGroup } from '../../../shared/types/types-form';
import { CategoryForm } from '../../core/types/cat-form';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { buildFilterForm, filterSort, mapParams } from '../../helpers';
import { FilterForm } from '../../core/types/filter-form';
import { BaseSearchComponent } from '../../../shared/base/search-base.component';
import { MODULES } from '../../../core/config/permissions/modules';
import { PageParamsModel } from '../../../shared/models/query/page-params.model';
import { CategoryNewEditModal } from "../../components/category-new-edit-modal/category-new-edit-modal";

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
    CategoryNewEditModal
],
  templateUrl: './category.html',
  styleUrl: './category.scss',
})
export class Category extends BaseSearchComponent{
  @ViewChild('categoryNewEditModal') categoryNewEditModal!: CategoryNewEditModal;
  public form!: TypedFormGroup<FilterForm>;
  #formBuilder = inject(FormBuilder);
  public title = 'Categorias';
  #categoryService = inject(CategoryService);
  public categories: CategoryModel[] = [];

  constructor(
    @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef
  ) {
    super(MODULES.ADMINISTRATION, viewContainerRef);
  }

  ngOnInit(): void {
    this.createForm();
    this.onSearch();
  }

  createForm(){
    this.form = this.#formBuilder.group(buildFilterForm())
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
    const subscription = this.#categoryService.search(params).subscribe({
      next: (response)=>{
        if(response.isValid){
          this.total = response.data.total;
          this.categories = response.data.items;
        }else{
          console.error(response);
        }
      },
      error: (response)=>{
        console.error(response.messages);
      }
    });
    this.subscriptions.push(subscription)
  }

   onPageChange(page: number): void {
    this.onSearch(this.filter, page);
  }

  onClean(){
    this.form.reset();
  }

  openModal(id?: number){
    if(this.categoryNewEditModal){
      this.categoryNewEditModal.openModal(id, ()=>{
        this.onSearch()
      })
    }
  }
}
