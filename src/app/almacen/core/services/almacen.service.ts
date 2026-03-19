import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../../../shared/services/base.service';
import { Observable } from 'rxjs';
import { ResponseDto } from '../../../shared/models/api/response.dto';
import { QueryParamsModel } from '../../../shared/models/query/query-params.model';
import { QueryResultsModel } from '../../../shared/models/query/query-results.model';
import { environment } from '../../../../environments/environment';
import { CreateAlmacenModel, GetAlmacenModel, UpdateAlmacenModel } from '../models';

@Injectable({
    providedIn: 'root',
})
export class AlmacenService extends BaseService {
    constructor(http: HttpClient) {
        super(http, `${environment.apiUrl}/almacenes`);
    }

    getAll(): Observable<ResponseDto<GetAlmacenModel[]>> {
        return this.getRequest<ResponseDto<GetAlmacenModel[]>>('');
    }

    getById(id: number): Observable<ResponseDto<GetAlmacenModel>> {
        return this.getRequest<ResponseDto<GetAlmacenModel>>(`/${id}`);
    }

    create(body: CreateAlmacenModel): Observable<ResponseDto<GetAlmacenModel>> {
        return this.postRequest<CreateAlmacenModel, ResponseDto<GetAlmacenModel>>(`/`, body);
    }

    delete(id: number): Observable<ResponseDto<GetAlmacenModel>> {
        return this.deleteRequest<ResponseDto<GetAlmacenModel>>(`/${id}`);
    }

    update(body: UpdateAlmacenModel): Observable<ResponseDto<GetAlmacenModel>> {
        return this.putRequest<UpdateAlmacenModel, ResponseDto<GetAlmacenModel>>(`/`, body);
    }

    search(body: QueryParamsModel): Observable<ResponseDto<QueryResultsModel<GetAlmacenModel>>> {
        return this.postRequest<QueryParamsModel, ResponseDto<QueryResultsModel<GetAlmacenModel>>>(
            `/search`,
            body
        );
    }
}
