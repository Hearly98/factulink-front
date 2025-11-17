import { Injectable } from '@angular/core';
import { BaseService } from '@shared/services/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseDto } from '@shared/models/api/response.dto';
import {
  CreateUnitOfMeasureModel,
  GetUnitOfMeasureModel,
  UpdateUnitOfMeasureModel,
} from '../models';
import { environment } from '@environments/environment';
import { QueryResultsModel } from '@shared/models/query/query-results.model';
import { QueryParamsModel } from '@shared/models/query/query-params.model';

@Injectable({
  providedIn: 'root',
})
export class UnitOfMeasureService extends BaseService {
  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/unidades`);
  }

  getAll(): Observable<ResponseDto<GetUnitOfMeasureModel[]>> {
    return this.getRequest('');
  }

  create(body: CreateUnitOfMeasureModel): Observable<ResponseDto<GetUnitOfMeasureModel>> {
    return this.postRequest<CreateUnitOfMeasureModel, ResponseDto<GetUnitOfMeasureModel>>(
      '/',
      body
    );
  }

  update(body: UpdateUnitOfMeasureModel): Observable<ResponseDto<GetUnitOfMeasureModel>> {
    return this.putRequest<UpdateUnitOfMeasureModel, ResponseDto<GetUnitOfMeasureModel>>('/', body);
  }

  getById(id: number): Observable<ResponseDto<GetUnitOfMeasureModel>> {
    return this.getRequest<ResponseDto<GetUnitOfMeasureModel>>(`/${id}`);
  }

  delete(id: number): Observable<ResponseDto<GetUnitOfMeasureModel>> {
    return this.deleteRequest(`/${id}`);
  }

  search(
    body: QueryParamsModel
  ): Observable<ResponseDto<QueryResultsModel<GetUnitOfMeasureModel>>> {
    return this.postRequest<
      QueryParamsModel,
      ResponseDto<QueryResultsModel<GetUnitOfMeasureModel>>
    >(`/search`, body);
  }
}
