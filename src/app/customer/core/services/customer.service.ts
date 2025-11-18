import { Injectable } from '@angular/core';
import { BaseService } from '../../../shared/services/base.service';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseDto } from '@shared/models/api/response.dto';
import { CreateCustomerModel, GetCustomerModel, UpdateCustomerModel } from '../models';
import { QueryParamsModel } from '@shared/models/query/query-params.model';
import { QueryResultsModel } from '@shared/models/query/query-results.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService extends BaseService {
  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/clientes`);
  }

  getAll(): Observable<ResponseDto<GetCustomerModel[]>> {
    return this.getRequest('');
  }

  create(body: CreateCustomerModel): Observable<ResponseDto<GetCustomerModel>> {
    return this.postRequest<CreateCustomerModel, ResponseDto<GetCustomerModel>>('/', body);
  }

  update(body: UpdateCustomerModel): Observable<ResponseDto<GetCustomerModel>> {
    return this.putRequest<UpdateCustomerModel, ResponseDto<GetCustomerModel>>('/', body);
  }

  getById(id: number): Observable<ResponseDto<GetCustomerModel>> {
    return this.getRequest<ResponseDto<GetCustomerModel>>(`/${id}`);
  }

  delete(id: number): Observable<ResponseDto<GetCustomerModel>> {
    return this.deleteRequest(`/${id}`);
  }

  search(body: QueryParamsModel): Observable<ResponseDto<QueryResultsModel<GetCustomerModel>>> {
    return this.postRequest<QueryParamsModel, ResponseDto<QueryResultsModel<GetCustomerModel>>>(
      `/search`,
      body
    );
  }
}
