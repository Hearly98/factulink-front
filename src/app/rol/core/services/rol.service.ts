import { Injectable } from '@angular/core';
import { BaseService } from '../../../shared/services/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseDto } from '../../../shared/models/api/response.dto';
import { QueryParamsModel } from '../../../shared/models/query/query-params.model';
import { QueryResultsModel } from '../../../shared/models/query/query-results.model';
import { CreateRolModel, GetRolModel, UpdateRolModel } from '../models';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class RolService extends BaseService {
  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/roles`);
  }

  getAll(): Observable<ResponseDto<GetRolModel[]>> {
    return this.getRequest('');
  }

  create(body: CreateRolModel): Observable<ResponseDto<GetRolModel>> {
    return this.postRequest<CreateRolModel, ResponseDto<GetRolModel>>('/', body);
  }

  update(body: UpdateRolModel): Observable<ResponseDto<GetRolModel>> {
    return this.putRequest<UpdateRolModel, ResponseDto<GetRolModel>>('/', body);
  }

  getById(id: number): Observable<ResponseDto<GetRolModel>> {
    return this.getRequest<ResponseDto<GetRolModel>>(`/${id}`);
  }

  delete(id: number): Observable<ResponseDto<GetRolModel>> {
    return this.deleteRequest(`/${id}`);
  }

  search(body: QueryParamsModel): Observable<ResponseDto<QueryResultsModel<GetRolModel>>> {
    return this.postRequest<QueryParamsModel, ResponseDto<QueryResultsModel<GetRolModel>>>(
      `/search`,
      body
    );
  }
}
