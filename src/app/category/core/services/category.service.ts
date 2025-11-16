import { Injectable } from '@angular/core';
import { BaseService } from '../../../shared/services/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryModel } from '../models/category.model';
import { ResponseDto } from '../../../shared/models/api/response.dto';
import { QueryParamsModel } from '../../../shared/models/query/query-params.model';
import { QueryResultsModel } from '../../../shared/models/query/query-results.model';
import { CreateCategoryModel, GetCategoryModel, UpdateCategoryModel } from '../models';

@Injectable({
  providedIn: 'root',
})
export class CategoryService extends BaseService {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:8000/api/v1/categorias');
  }

  getAll(): Observable<ResponseDto<GetCategoryModel[]>> {
    return this.getRequest('');
  }

  create(body: CreateCategoryModel): Observable<ResponseDto<GetCategoryModel>> {
    return this.postRequest<CreateCategoryModel, ResponseDto<GetCategoryModel>>("/", body)
  }

  update(body: UpdateCategoryModel): Observable<ResponseDto<GetCategoryModel>> {
    return this.putRequest<UpdateCategoryModel, ResponseDto<GetCategoryModel>>("/", body)
  }

  getById(id: number): Observable<ResponseDto<GetCategoryModel>> {
    return this.getRequest<ResponseDto<GetCategoryModel>>(`/${id}`)
  }

  delete(id: number): Observable<ResponseDto<GetCategoryModel>> {
    return this.deleteRequest(`/${id}`)
  }

  search(body: QueryParamsModel): Observable<ResponseDto<QueryResultsModel<GetCategoryModel>>> {
    return this.postRequest<QueryParamsModel, ResponseDto<QueryResultsModel<GetCategoryModel>>>(
      `/search`,
      body
    );
  }
}
