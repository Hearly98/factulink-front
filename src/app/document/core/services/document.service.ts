import { Injectable } from '@angular/core';
import { BaseService } from '../../../shared/services/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseDto } from '../../../shared/models/api/response.dto';
import { QueryParamsModel } from '../../../shared/models/query/query-params.model';
import { QueryResultsModel } from '../../../shared/models/query/query-results.model';
import { DocumentModel } from '../models/document.model';
import { environment } from '../../../../environments/environment';
import { CreateDocumentModel } from '../models/create-document.model';
import { UpdateDocumentModel } from '../models/update-document.model';
import { GetDocumentModel } from '../models/get-document.model';
@Injectable({
  providedIn: 'root',
})
export class DocumentService extends BaseService {
  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/documentos`);
  }

  getAll(): Observable<ResponseDto<GetDocumentModel[]>> {
    return this.getRequest<ResponseDto<GetDocumentModel[]>>('');
  }

  getById(id: number): Observable<ResponseDto<GetDocumentModel>> {
    return this.getRequest<ResponseDto<GetDocumentModel>>(`/${id}`);
  }

  delete(id: number): Observable<ResponseDto<GetDocumentModel>> {
    return this.deleteRequest<ResponseDto<GetDocumentModel>>(`/${id}`);
  }

  create(body: CreateDocumentModel): Observable<ResponseDto<GetDocumentModel>> {
    return this.postRequest<CreateDocumentModel, ResponseDto<GetDocumentModel>>(`/`, body);
  }

  update(body: UpdateDocumentModel): Observable<ResponseDto<GetDocumentModel>> {
    return this.putRequest<UpdateDocumentModel, ResponseDto<GetDocumentModel>>('/', body);
  }

  search(body: QueryParamsModel): Observable<ResponseDto<QueryResultsModel<GetDocumentModel>>> {
    return this.postRequest<QueryParamsModel, ResponseDto<QueryResultsModel<GetDocumentModel>>>(
      `/search`,
      body
    );
  }
}
