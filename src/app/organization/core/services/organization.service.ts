import { Injectable } from '@angular/core';
import { BaseService } from '../../../shared/services/base.service';
import { HttpClient } from '@angular/common/http';
import { GetOrganizationModel } from '../models/get-organization.model';
import { ResponseDto } from '../../../shared/models/api/response.dto';
import { QueryParamsModel } from '../../../shared/models/query/query-params.model';
import { QueryResultsModel } from '../../../shared/models/query/query-results.model';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
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

  search(body: QueryParamsModel): Observable<ResponseDto<QueryResultsModel<GetOrganizationModel>>> {
    return this.postRequest<QueryParamsModel, ResponseDto<QueryResultsModel<GetOrganizationModel>>>(
      `/search`,
      body
    );
  }
}
