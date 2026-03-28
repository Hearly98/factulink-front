import { Injectable } from '@angular/core';
import { BaseService } from '../../../shared/services/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  create(body: CreateProductModel | FormData): Observable<ResponseDto<GetProductModel>> {
    if (body instanceof FormData) {
      return this.postRequestForm<ResponseDto<GetProductModel>>('/', body);
    }
    return this.postRequest<CreateProductModel, ResponseDto<GetProductModel>>('/', body);
  }

  createBulk(body: CreateProductModel | FormData): Observable<ResponseDto<GetProductModel>> {
    if (body instanceof FormData) {
      return this.postRequestForm<ResponseDto<GetProductModel>>('/bulk', body);
    }
    return this.postRequest<CreateProductModel, ResponseDto<GetProductModel>>('/bulk', body);
  }

  update(body: UpdateProductModel | FormData): Observable<ResponseDto<GetProductModel>> {
    if (body instanceof FormData) {
      return this.postRequestForm<ResponseDto<GetProductModel>>('/update', body);
    }
    return this.postRequest<UpdateProductModel, ResponseDto<GetProductModel>>('/update', body);
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

  searchQuick(body: {
    term: string;
    suc_id?: number;
    alm_id?: number;
  }): Observable<ResponseDto<GetProductModel[]>> {
    return this.postRequest(`/search-quick`, body);
  }

  /**
   * Search all products without warehouse requirement
   * Used for Cotizaciones where stock is not affected
   */
  searchAll(term: string): Observable<ResponseDto<GetProductModel[]>> {
    return this.postRequest('/search-all', { term });
  }
}
