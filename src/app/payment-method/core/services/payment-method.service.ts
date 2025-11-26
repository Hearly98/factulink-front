import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { ResponseDto } from '@shared/models/api/response.dto';
import { BaseService } from '@shared/services/base.service';
import { Observable } from 'rxjs';
import {
  GetPaymentMethodModel,
  CreatePaymentMethodModel,
  UpdatePaymentMethodModel,
} from '../models';
import { QueryParamsModel } from '@shared/models/query/query-params.model';
import { QueryResultsModel } from '@shared/models/query/query-results.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentMethodService extends BaseService {
  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/metodo_pagos`);
  }

  getAll(): Observable<ResponseDto<GetPaymentMethodModel[]>> {
    return this.getRequest<ResponseDto<GetPaymentMethodModel[]>>('');
  }

  getById(id: number): Observable<ResponseDto<GetPaymentMethodModel>> {
    return this.getRequest<ResponseDto<GetPaymentMethodModel>>(`/${id}`);
  }

  delete(id: number): Observable<ResponseDto<GetPaymentMethodModel>> {
    return this.deleteRequest<ResponseDto<GetPaymentMethodModel>>(`/${id}`);
  }

  create(body: CreatePaymentMethodModel): Observable<ResponseDto<GetPaymentMethodModel>> {
    return this.postRequest<CreatePaymentMethodModel, ResponseDto<GetPaymentMethodModel>>(
      `/`,
      body
    );
  }

  update(body: UpdatePaymentMethodModel): Observable<ResponseDto<GetPaymentMethodModel>> {
    return this.putRequest<UpdatePaymentMethodModel, ResponseDto<GetPaymentMethodModel>>('/', body);
  }

  search(
    body: QueryParamsModel
  ): Observable<ResponseDto<QueryResultsModel<GetPaymentMethodModel>>> {
    return this.postRequest<
      QueryParamsModel,
      ResponseDto<QueryResultsModel<GetPaymentMethodModel>>
    >(`/search`, body);
  }
}
