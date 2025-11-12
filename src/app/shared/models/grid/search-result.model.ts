export class SearchResultModel<TModel> {
    total: number = 0;
    page: number = 1;
    pageSize: number = 10;
    items: TModel[] = [];
}
