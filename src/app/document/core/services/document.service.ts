import { Injectable } from '@angular/core';
import { BaseService } from '../../../shared/services/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseDto } from '../../../shared/models/api/response.dto';
import { QueryParamsModel } from '../../../shared/models/query/query-params.model';
import { QueryResultsModel } from '../../../shared/models/query/query-results.model';
import { DocumentModel } from '../models/document.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentService extends BaseService {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:8000/api/v1/documentos');
  }

  getAll(): Observable<ResponseDto<DocumentModel[]>> {
    return this.getRequest<ResponseDto<DocumentModel[]>>('');
  }

  getById(id: number): Observable<ResponseDto<DocumentModel>> {
    return this.getRequest<ResponseDto<DocumentModel>>(`/${id}`);
  }

  search(body: QueryParamsModel): Observable<ResponseDto<QueryResultsModel<DocumentModel>>> {
    return this.postRequest<QueryParamsModel, ResponseDto<QueryResultsModel<DocumentModel>>>(
      `/search`,
      body
    );
  }
}
