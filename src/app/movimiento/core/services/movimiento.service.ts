import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../../../shared/services/base.service';
import { Observable } from 'rxjs';
import { ResponseDto } from '../../../shared/models/api/response.dto';
import { QueryParamsModel } from '../../../shared/models/query/query-params.model';
import { QueryResultsModel } from '../../../shared/models/query/query-results.model';
import { GetMovimientoModel } from '../models/get-movimiento.model';

@Injectable({
  providedIn: 'root',
})
export class MovimientoService extends BaseService {
  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/movimientos-documentos`);
  }

  search(body: QueryParamsModel): Observable<ResponseDto<QueryResultsModel<GetMovimientoModel>>> {
    return this.postRequest<QueryParamsModel, ResponseDto<QueryResultsModel<GetMovimientoModel>>>(
      `/search`,
      body,
    );
  }

  getById(id: number): Observable<ResponseDto<any>> {
    return this.getRequest<ResponseDto<any>>(`/${id}`);
  }

  create(body: any): Observable<ResponseDto<any>> {
    return this.postRequest<any, ResponseDto<any>>(``, body);
  }

  anular(id: number, motivo: string): Observable<ResponseDto<any>> {
    return this.postRequest<{ motivo: string }, ResponseDto<any>>(`/${id}/anular`, { motivo });
  }

  print(id: number) {
    return this.http.get(`${environment.apiUrl}/movimientos-documentos/${id}/pdf`, {
      responseType: 'blob',
      observe: 'response',
    });
  }
}
