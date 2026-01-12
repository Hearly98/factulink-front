import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../../../shared/services/base.service';
import { Observable } from 'rxjs';
import { ResponseDto } from '../../../shared/models/api/response.dto';
import { QueryParamsModel } from '../../../shared/models/query/query-params.model';
import { QueryResultsModel } from '../../../shared/models/query/query-results.model';
import { environment } from '../../../../environments/environment';
import { CreateProductoSucursalModel, GetProductoSucursalModel, UpdateProductoSucursalModel } from '../models';

@Injectable({
    providedIn: 'root',
})
export class ProductoSucursalService extends BaseService {
    constructor(http: HttpClient) {
        super(http, `${environment.apiUrl}/productos-sucursal`);
    }

    getAll(): Observable<ResponseDto<GetProductoSucursalModel[]>> {
        return this.getRequest<ResponseDto<GetProductoSucursalModel[]>>('');
    }

    getById(id: number): Observable<ResponseDto<GetProductoSucursalModel>> {
        return this.getRequest<ResponseDto<GetProductoSucursalModel>>(`/${id}`);
    }

    create(body: CreateProductoSucursalModel): Observable<ResponseDto<GetProductoSucursalModel>> {
        return this.postRequest<CreateProductoSucursalModel, ResponseDto<GetProductoSucursalModel>>(`/`, body);
    }

    delete(id: number): Observable<ResponseDto<GetProductoSucursalModel>> {
        return this.deleteRequest<ResponseDto<GetProductoSucursalModel>>(`/${id}`);
    }

    update(body: UpdateProductoSucursalModel): Observable<ResponseDto<GetProductoSucursalModel>> {
        return this.putRequest<UpdateProductoSucursalModel, ResponseDto<GetProductoSucursalModel>>(`/${body.prodsuc_id}`, body);
    }

    search(body: QueryParamsModel): Observable<ResponseDto<QueryResultsModel<GetProductoSucursalModel>>> {
        return this.postRequest<QueryParamsModel, ResponseDto<QueryResultsModel<GetProductoSucursalModel>>>(
            `/search`,
            body
        );
    }
}
