import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { BaseService } from '@shared/services/base.service';
import { PurchaseCreateDto } from '../purchase-create-dto';
import { Observable } from 'rxjs';
import { ResponseDto } from '@shared/models/api/response.dto';
import { QueryParamsModel } from '@shared/models/query/query-params.model';
import { QueryResultsModel } from '@shared/models/query/query-results.model';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService extends BaseService {
  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/compras`);
  }

  getAll(): Observable<ResponseDto<any[]>> {
    return this.getRequest('');
  }

  create(body: PurchaseCreateDto): Observable<ResponseDto<any>> {
    return this.postRequest(`/`, body);
  }

  delete(id: number): Observable<ResponseDto<any>> {
    return this.deleteRequest(`${id}`)
  }

  update(body: any): Observable<ResponseDto<any>> {
    return this.putRequest('/', body);
  }

  get(id: number): Observable<ResponseDto<any>> {
    return this.getRequest(`/${id}`);
  }

  search(body: QueryParamsModel): Observable<ResponseDto<QueryResultsModel<any>>> {
    return this.postRequest<QueryParamsModel, ResponseDto<QueryResultsModel<any>>>(
      `/search`,
      body
    );
  }
}
