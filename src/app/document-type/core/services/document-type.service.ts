import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { ResponseDto } from '@shared/models/api/response.dto';
import { BaseService } from '@shared/services/base.service';
import { Observable } from 'rxjs';
import { CreateDocumentTypeModel, GetDocumentTypeModel, UpdateDocumentTypeModel } from '../models';
import { QueryParamsModel } from '@shared/models/query/query-params.model';
import { QueryResultsModel } from '@shared/models/query/query-results.model';

@Injectable({
  providedIn: 'root',
})
export class DocumentTypeService extends BaseService {
  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/tipo_documentos`);
  }

  getAll(): Observable<ResponseDto<GetDocumentTypeModel[]>> {
    return this.getRequest('');
  }

  create(body: CreateDocumentTypeModel): Observable<ResponseDto<GetDocumentTypeModel>> {
    return this.postRequest<CreateDocumentTypeModel, ResponseDto<GetDocumentTypeModel>>('/', body);
  }

  update(body: UpdateDocumentTypeModel): Observable<ResponseDto<GetDocumentTypeModel>> {
    return this.putRequest<UpdateDocumentTypeModel, ResponseDto<GetDocumentTypeModel>>('/', body);
  }

  getById(id: number): Observable<ResponseDto<GetDocumentTypeModel>> {
    return this.getRequest<ResponseDto<GetDocumentTypeModel>>(`/${id}`);
  }

  delete(id: number): Observable<ResponseDto<GetDocumentTypeModel>> {
    return this.deleteRequest(`/${id}`);
  }

  search(body: QueryParamsModel): Observable<ResponseDto<QueryResultsModel<GetDocumentTypeModel>>> {
    return this.postRequest<QueryParamsModel, ResponseDto<QueryResultsModel<GetDocumentTypeModel>>>(
      `/search`,
      body
    );
  }
}
