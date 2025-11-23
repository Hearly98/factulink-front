import { Injectable } from '@angular/core';
import { BaseService } from '../../../shared/services/base.service';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ProductModel } from '../models/product.model';
import { ResponseDto } from '../../../shared/models/api/response.dto';
import { QueryParamsModel } from '../../../shared/models/query/query-params.model';
import { QueryResultsModel } from '../../../shared/models/query/query-results.model';
import { CreateProductModel, GetProductModel, UpdateProductModel } from '../models';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ProductService extends BaseService {
  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/productos`);
  }

  getAll(): Observable<ResponseDto<GetProductModel[]>> {
    return this.getRequest('');
  }

  create(body: CreateProductModel): Observable<ResponseDto<GetProductModel>> {
    return this.postRequest<CreateProductModel, ResponseDto<GetProductModel>>('/', body);
  }

  update(body: UpdateProductModel): Observable<ResponseDto<GetProductModel>> {
    return this.putRequest<UpdateProductModel, ResponseDto<GetProductModel>>('/', body);
  }

  getById(id: number): Observable<ResponseDto<GetProductModel>> {
    return this.getRequest<ResponseDto<GetProductModel>>(`/${id}`);
  }

  delete(id: number): Observable<ResponseDto<GetProductModel>> {
    return this.deleteRequest(`/${id}`);
  }

  search(body: QueryParamsModel): Observable<ResponseDto<QueryResultsModel<GetProductModel>>> {
    return this.postRequest<QueryParamsModel, ResponseDto<QueryResultsModel<GetProductModel>>>(
      `/search`,
      body
    );
  }

  searchQuick(term: string): Observable<GetProductModel[]> {
    const body = new QueryParamsModel(
      { prod_nom: term }, // filter
      { page: 1, pageSize: 10 }, // page
      [{ property: 'prod_nom', direction: 'asc' }] // sort
    );

    return this.search(body).pipe(map((response) => response.data.items));
  }
}
