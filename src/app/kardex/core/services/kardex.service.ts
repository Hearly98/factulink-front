import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../../../shared/services/base.service';
import { Observable } from 'rxjs';
import { ResponseDto } from '../../../shared/models/api/response.dto';
import { QueryParamsModel } from '../../../shared/models/query/query-params.model';
import { QueryResultsModel } from '../../../shared/models/query/query-results.model';
import { environment } from '../../../../environments/environment';
import { GetKardexModel } from '../models/get-kardex.model';

@Injectable({
    providedIn: 'root',
})
export class KardexService extends BaseService {
    constructor(http: HttpClient) {
        super(http, `${environment.apiUrl}/kardex`);
    }

    search(body: QueryParamsModel): Observable<ResponseDto<QueryResultsModel<GetKardexModel>>> {
        return this.postRequest<QueryParamsModel, ResponseDto<QueryResultsModel<GetKardexModel>>>(
            `/search`,
            body
        );
    }
}
