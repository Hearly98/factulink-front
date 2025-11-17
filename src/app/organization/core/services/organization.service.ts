import { Injectable } from '@angular/core';
import { BaseService } from '../../../shared/services/base.service';
import { HttpClient } from '@angular/common/http';
import { ResponseDto } from '../../../shared/models/api/response.dto';
import { QueryParamsModel } from '../../../shared/models/query/query-params.model';
import { QueryResultsModel } from '../../../shared/models/query/query-results.model';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CreateOrganizationModel, UpdateOrganizationModel, GetOrganizationModel } from '../models';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService extends BaseService {
  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/empresas`);
  }
  getAll(): Observable<ResponseDto<GetOrganizationModel[]>> {
    return this.getRequest<ResponseDto<GetOrganizationModel[]>>('');
  }

  getById(id: number): Observable<ResponseDto<GetOrganizationModel>> {
    return this.getRequest<ResponseDto<GetOrganizationModel>>(`/${id}`);
  }

  create(body: CreateOrganizationModel): Observable<ResponseDto<GetOrganizationModel>> {
    return this.postRequest<CreateOrganizationModel, ResponseDto<GetOrganizationModel>>('/', body);
  }

  update(body: UpdateOrganizationModel): Observable<ResponseDto<GetOrganizationModel>> {
    return this.putRequest<UpdateOrganizationModel, ResponseDto<GetOrganizationModel>>('/', body);
  }

  delete(id: number): Observable<ResponseDto<GetOrganizationModel>> {
    return this.deleteRequest(`/${id}`);
  }

  search(body: QueryParamsModel): Observable<ResponseDto<QueryResultsModel<GetOrganizationModel>>> {
    return this.postRequest<QueryParamsModel, ResponseDto<QueryResultsModel<GetOrganizationModel>>>(
      `/search`,
      body
    );
  }
}
