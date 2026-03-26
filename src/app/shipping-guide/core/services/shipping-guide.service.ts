import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../../../shared/services/base.service';
import { environment } from '../../../../environments/environment';
import { ResponseDto } from '../../../shared/models/api/response.dto';
import { ShippingGuideModel } from '../models/shipping-guide.model';
import { QueryParamsModel } from '../../../shared/models/query/query-params.model';
import { QueryResultsModel } from '../../../shared/models/query/query-results.model';
import { SerieModel } from 'src/app/series/core/models/serie.model';

@Injectable({
  providedIn: 'root',
})
export class ShippingGuideService extends BaseService {
  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/guias-remision`);
  }

  search(params: QueryParamsModel): Observable<ResponseDto<QueryResultsModel<ShippingGuideModel>>> {
    return this.postRequest<QueryParamsModel, ResponseDto<QueryResultsModel<ShippingGuideModel>>>(
      `/search`,
      params
    );
  }

  getSeries(): Observable<ResponseDto<SerieModel[]>> {
    return this.getRequest<ResponseDto<SerieModel[]>>(`/series`);
  }

  getById(id: number): Observable<ResponseDto<ShippingGuideModel>> {
    return this.getRequest<ResponseDto<ShippingGuideModel>>(`/${id}`);
  }

  create(data: any): Observable<ResponseDto<ShippingGuideModel>> {
    return this.postRequest<any, ResponseDto<ShippingGuideModel>>('/', data);
  }

  delete(id: number): Observable<ResponseDto<void>> {
    return this.deleteRequest(`/${id}`);
  }

  update(id: number, data: any): Observable<ResponseDto<ShippingGuideModel>> {
    return this.putRequest<any, ResponseDto<ShippingGuideModel>>(`/${id}`, data);
  }

  print(id: number): Observable<HttpResponse<Blob>> {
    return this.http.get(`${environment.apiUrl}/guias-remision/${id}/print`, {
      responseType: 'blob',
      observe: 'response',
    });
  }
}