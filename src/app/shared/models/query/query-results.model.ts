export class QueryResultsModel<T> {
  items: T[];
  total: number;
  page: number = 1;
  pageSize: number = 10;
  errorMessage: string;

  constructor(items: any[] = [], total: number = 0, errorMessage: string = '') {
    this.items = items;
    this.total = total;
    this.errorMessage = errorMessage;
  }
}
