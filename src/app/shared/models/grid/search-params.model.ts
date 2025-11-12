import { SearchParamsBaseModel } from './search-params-base.model'

export class SearchParamsModel extends SearchParamsBaseModel {
    filter: any;

    constructor(filter: any, page: number = 1, pageSize: number = 10) {
        super(page, pageSize)
        this.filter = filter;
    }
}