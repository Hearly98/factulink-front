import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../../../shared/services/base.service';
import { QueryParamsModel } from '@shared/models/query/query-params.model';
import { map, Observable } from 'rxjs';
import { ResponseDto } from '@shared/models/api/response.dto';
import { GetSupplierModel } from '../models/get-supplier.model';
import { QueryResultsModel } from '@shared/models/query/query-results.model';
import { CreateSupplierModel } from '../models';
import { UpdateSupplierModel } from '../models/update-supplier.model';

@Injectable({
  providedIn: 'root',
})
export class SupplierService extends BaseService {
  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/proveedores`);
  }

  getAll(): Observable<ResponseDto<GetSupplierModel[]>> {
    return this.getRequest('');
  }

  create(body: CreateSupplierModel): Observable<ResponseDto<GetSupplierModel>> {
    return this.postRequest<CreateSupplierModel, ResponseDto<GetSupplierModel>>('/', body);
  }

  update(body: UpdateSupplierModel): Observable<ResponseDto<GetSupplierModel>> {
    return this.putRequest<UpdateSupplierModel, ResponseDto<GetSupplierModel>>('/', body);
  }

  getById(id: number): Observable<ResponseDto<GetSupplierModel>> {
    return this.getRequest<ResponseDto<GetSupplierModel>>(`/${id}`);
  }

  delete(id: number): Observable<ResponseDto<GetSupplierModel>> {
    return this.deleteRequest(`/${id}`);
  }

  search(body: QueryParamsModel): Observable<ResponseDto<QueryResultsModel<GetSupplierModel>>> {
    return this.postRequest<QueryParamsModel, ResponseDto<QueryResultsModel<GetSupplierModel>>>(
      `/search`,
      body
    );
  }

  searchQuick(term: string): Observable<GetSupplierModel[]> {
    const body = new QueryParamsModel(
      { prov_nom: term }, // filter
      { page: 1, pageSize: 10 }, // page
      [{ property: 'prov_nom', direction: 'asc' }] // sort
    );

    return this.search(body).pipe(map((response) => response.data.items));
  }
}
