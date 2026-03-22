import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { BaseService } from '@shared/services/base.service';
import { CreateUserModel, GetUserModel, UpdateUserModel } from '../models';
import { Observable } from 'rxjs';
import { ResponseDto } from '@shared/models/api/response.dto';
import { QueryParamsModel } from '@shared/models/query/query-params.model';
import { QueryResultsModel } from '@shared/models/query/query-results.model';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService {
  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/usuarios`);
  }
  getAll(): Observable<ResponseDto<GetUserModel[]>> {
    return this.getRequest('');
  }

  create(body: CreateUserModel): Observable<ResponseDto<GetUserModel>> {
    return this.postRequest<CreateUserModel, ResponseDto<GetUserModel>>('/', body);
  }

  update(body: UpdateUserModel): Observable<ResponseDto<GetUserModel>> {
    return this.putRequest<UpdateUserModel, ResponseDto<GetUserModel>>('/', body);
  }

  getById(id: number): Observable<ResponseDto<GetUserModel>> {
    return this.getRequest<ResponseDto<GetUserModel>>(`/${id}`);
  }

  delete(id: number): Observable<ResponseDto<GetUserModel>> {
    return this.deleteRequest(`/${id}`);
  }

  search(body: QueryParamsModel): Observable<ResponseDto<QueryResultsModel<GetUserModel>>> {
    return this.postRequest<QueryParamsModel, ResponseDto<QueryResultsModel<GetUserModel>>>(
      `/search`,
      body
    );
  }

  getMe(): Observable<ResponseDto<GetUserModel>> {
    return this.getRequest<ResponseDto<GetUserModel>>('/me');
  }
}
