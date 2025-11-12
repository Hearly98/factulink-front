import { Inject, ViewContainerRef } from '@angular/core';
import { BaseComponent } from './base.component';
import { PageParamsModel } from '../models/query/page-params.model';
import { SortParamsModel } from '../models/query/sort-params.model';
import { QueryParamsModel } from '../models/query/query-params.model';

@Inject('BaseComponent')
export abstract class BaseSearchComponent extends BaseComponent {
  public filter = null;
  public total = 0;
  public page: PageParamsModel;
  public sort: SortParamsModel[];

  constructor(module: string, @Inject(ViewContainerRef) viewContainerRef: ViewContainerRef) {
    super(module, viewContainerRef);

    this.page = new PageParamsModel(1, 10);
    this.sort = [];
  }

  updateSort(sort: any) {
    this.sort = sort;
  }

  updateFilter(filter: any) {
    this.filter = filter;
  }

  updatePageSize(size: number) {
    this.page.pageSize = size;
  }

  updatePage(page: PageParamsModel) {
    this.page = page;
  }

  updatePageCurrent(page: number) {
    this.page.page = page;
  }

  getPageParams(): QueryParamsModel {
    const params = new QueryParamsModel(this.filter, this.page, this.sort);
    return params;
  }
}
