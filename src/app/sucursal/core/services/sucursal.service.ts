import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../../../shared/services/base.service';
import { Observable } from 'rxjs';
import { ResponseDto } from '../../../shared/models/api/response.dto';
import { QueryParamsModel } from '../../../shared/models/query/query-params.model';
import { QueryResultsModel } from '../../../shared/models/query/query-results.model';
import { environment } from '../../../../environments/environment';
import { CreateSucursalModel, GetSucursalModel, UpdateSucursalModel } from '../models';

@Injectable({
  providedIn: 'root',
})
export class SucursalService extends BaseService {
  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/sucursales`);
  }

  getAll(): Observable<ResponseDto<GetSucursalModel[]>> {
    return this.getRequest<ResponseDto<GetSucursalModel[]>>('');
  }

  getById(id: number): Observable<ResponseDto<GetSucursalModel>> {
    return this.getRequest<ResponseDto<GetSucursalModel>>(`/${id}`);
  }

  create(body: CreateSucursalModel): Observable<ResponseDto<GetSucursalModel>> {
    return this.postRequest<CreateSucursalModel, ResponseDto<GetSucursalModel>>(`/`, body);
  }

  delete(id: number): Observable<ResponseDto<GetSucursalModel>> {
    return this.deleteRequest<ResponseDto<GetSucursalModel>>(`/${id}`);
  }

  update(body: UpdateSucursalModel): Observable<ResponseDto<GetSucursalModel>> {
    return this.putRequest<UpdateSucursalModel, ResponseDto<GetSucursalModel>>(`/`, body);
  }

  search(body: QueryParamsModel): Observable<ResponseDto<QueryResultsModel<GetSucursalModel>>> {
    return this.postRequest<QueryParamsModel, ResponseDto<QueryResultsModel<GetSucursalModel>>>(
      `/search`,
      body
    );
  }

  getStockBySucursal(sucId: number): Observable<ResponseDto<StockBySucursalModel>> {
    return this.getRequest<ResponseDto<StockBySucursalModel>>(`/${sucId}/stock`);
  }
}

export interface StockBySucursalModel {
  suc_id: number;
  suc_nom: string;
  total_stock: number;
  productos: StockProductoModel[];
}

export interface StockProductoModel {
  prod_id: number;
  prod_nom: string;
  prod_cod_interno: string;
  stock_total: number;
  por_almacen: StockPorAlmacenModel[];
}

export interface StockPorAlmacenModel {
  almacen_id: number;
  almacen_nombre: string;
  almacen_codigo: string;
  stock_actual: number;
}
