import { PageParamsModel } from "./page-params.model";
import { SortParamsModel } from "./sort-params.model";

export class QueryParamsModel {
  filter: any;
  page: PageParamsModel;
  sort: SortParamsModel[];

  constructor(filter: any, page: PageParamsModel, sort: SortParamsModel[]) {
    this.filter = filter;
    this.page = page;
    this.sort = sort;
  }
}
