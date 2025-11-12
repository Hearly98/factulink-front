import { Injectable } from '@angular/core';
import { BaseService } from '../../../shared/services/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryModel } from '../models/category.model';
import { ResponseDto } from '../../../shared/models/api/response.dto';
import { QueryParamsModel } from '../../../shared/models/query/query-params.model';
import { QueryResultsModel } from '../../../shared/models/query/query-results.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService extends BaseService {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:8000/api/v1/categorias');
  }

  getAll(): Observable<CategoryModel[]> {
    return this.getRequest('');
  }

  getById(id: number): Observable<ResponseDto<CategoryModel>>{
    return this.getRequest<ResponseDto<CategoryModel>>(`/show/${id}`)
  }

  search(body: QueryParamsModel): Observable<ResponseDto<QueryResultsModel<CategoryModel>>> {
    return this.postRequest<QueryParamsModel, ResponseDto<QueryResultsModel<CategoryModel>>>(
      `/search`,
      body
    );
  }
}
