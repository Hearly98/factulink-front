import { Injectable } from '@angular/core';
import { BaseService } from '../../../shared/services/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseDto } from '../../../shared/models/api/response.dto';
import { QueryParamsModel } from '../../../shared/models/query/query-params.model';
import { QueryResultsModel } from '../../../shared/models/query/query-results.model';
import { GetCompanyModel } from '../models/get-company.model';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class CompanyService extends BaseService {
  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/companias`);
  }

  getAll(): Observable<ResponseDto<GetCompanyModel[]>> {
    return this.getRequest<ResponseDto<GetCompanyModel[]>>('');
  }

  getById(id: number): Observable<ResponseDto<GetCompanyModel>> {
    return this.getRequest<ResponseDto<GetCompanyModel>>(`/${id}`);
  }

  search(body: QueryParamsModel): Observable<ResponseDto<QueryResultsModel<GetCompanyModel>>> {
    return this.postRequest<QueryParamsModel, ResponseDto<QueryResultsModel<GetCompanyModel>>>(
      `/search`,
      body
    );
  }
}
