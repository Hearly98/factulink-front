import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../../../shared/services/base.service';
import { Observable } from 'rxjs';
import { ResponseDto } from '../../../shared/models/api/response.dto';
import { QueryParamsModel } from '../../../shared/models/query/query-params.model';
import { QueryResultsModel } from '../../../shared/models/query/query-results.model';
import { environment } from '../../../../environments/environment';
import { GetMovimientoModel, MovimientoModel } from '../models/movimiento.model';

@Injectable({
    providedIn: 'root',
})
export class MovimientoService extends BaseService {
    constructor(http: HttpClient) {
        super(http, `${environment.apiUrl}/kardex/movimientos`);
    }

    getAll(): Observable<ResponseDto<GetMovimientoModel[]>> {
        return this.getRequest<ResponseDto<GetMovimientoModel[]>>('');
    }

    getById(id: number): Observable<ResponseDto<GetMovimientoModel>> {
        return this.getRequest<ResponseDto<GetMovimientoModel>>(`/${id}`);
    }

    create(body: MovimientoModel): Observable<ResponseDto<GetMovimientoModel>> {
        return this.postRequest<MovimientoModel, ResponseDto<GetMovimientoModel>>(`/`, body);
    }

    update(body: MovimientoModel): Observable<ResponseDto<GetMovimientoModel>> {
        return this.putRequest<MovimientoModel, ResponseDto<GetMovimientoModel>>('/', body);
    }

    delete(id: number): Observable<ResponseDto<GetMovimientoModel>> {
        return this.deleteRequest(`/${id}`);
    }

    search(body: QueryParamsModel): Observable<ResponseDto<QueryResultsModel<GetMovimientoModel>>> {
        return this.postRequest<QueryParamsModel, ResponseDto<QueryResultsModel<GetMovimientoModel>>>(
            `/search`,
            body
        );
    }
}
