import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../../../shared/services/base.service';
import { Observable } from 'rxjs';
import { ResponseDto } from '../../../shared/models/api/response.dto';
import { QueryParamsModel } from '../../../shared/models/query/query-params.model';
import { QueryResultsModel } from '../../../shared/models/query/query-results.model';
import { GetSucursalModel } from '../models';

@Injectable({
  providedIn: 'root',
})
export class SucursalService extends BaseService {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:8000/api/v1/sucursales');
  }

  getAll(): Observable<ResponseDto<GetSucursalModel[]>> {
    return this.getRequest<ResponseDto<GetSucursalModel[]>>('');
  }

  getById(id: number): Observable<ResponseDto<GetSucursalModel>> {
    return this.getRequest<ResponseDto<GetSucursalModel>>(`/${id}`);
  }

  search(body: QueryParamsModel): Observable<ResponseDto<QueryResultsModel<GetSucursalModel>>> {
    return this.postRequest<QueryParamsModel, ResponseDto<QueryResultsModel<GetSucursalModel>>>(
      `/search`,
      body
    );
  }
}
