import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../../../shared/services/base.service';
import { Observable } from 'rxjs';
import { ResponseDto } from '../../../shared/models/api/response.dto';
import { environment } from '../../../../environments/environment';

export interface ProductoAlmacenModel {
  id: number;
  prod_id: number;
  almacen_id: number;
  stock_actual: number;
  precio_compra_base: number | null;
  precio_venta_base: number | null;
  activo: boolean;
  producto?: {
    prod_id: number;
    prod_cod_interno: string;
    prod_nom: string;
  };
  almacen?: {
    almacen_id: number;
    alm_nom: string;
  };
}

@Injectable({
    providedIn: 'root',
})
export class ProductoAlmacenService extends BaseService {
    constructor(http: HttpClient) {
        super(http, `${environment.apiUrl}/producto-almacen`);
    }

    getByAlmacen(almacenId: number): Observable<ResponseDto<ProductoAlmacenModel[]>> {
        return this.getRequest<ResponseDto<ProductoAlmacenModel[]>>(`/almacen/${almacenId}`);
    }

    getByProducto(productoId: number): Observable<ResponseDto<ProductoAlmacenModel[]>> {
        return this.getRequest<ResponseDto<ProductoAlmacenModel[]>>(`/producto/${productoId}`);
    }
}
