import { Injectable, inject } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { AlmacenService } from '../../../almacen/core/services/almacen.service';
import { ProductService } from '../../../products/core/services/product.service';
import { MovimientoService } from './movimiento.service';
import { GetAlmacenModel } from '../../../almacen/core/models';
import { GetProductModel } from '../../../products/core/models';
import { ResponseDto } from '../../../shared/models/api/response.dto';
import { GetMovimientoModel } from '../models/movimiento.model';
import { QueryParamsModel } from '../../../shared/models/query/query-params.model';
import { QueryResultsModel } from '../../../shared/models/query/query-results.model';

export interface MovimientoCombosData {
  almacenes: GetAlmacenModel[];
  productos: GetProductModel[];
}

@Injectable({
  providedIn: 'root',
})
export class MovimientoFacade {
  readonly #almacenService = inject(AlmacenService);
  readonly #productService = inject(ProductService);
  readonly #movimientoService = inject(MovimientoService);

  loadCombos(): Observable<ResponseDto<MovimientoCombosData>> {
    return forkJoin({
      almacenes: this.#almacenService.getAll(),
      productos: this.#productService.getAll(),
    }) as any;
  }

  search(params: QueryParamsModel): Observable<ResponseDto<QueryResultsModel<GetMovimientoModel>>> {
    return this.#movimientoService.search(params);
  }

  getById(id: number): Observable<ResponseDto<GetMovimientoModel>> {
    return this.#movimientoService.getById(id);
  }

  create(body: any): Observable<ResponseDto<GetMovimientoModel>> {
    return this.#movimientoService.create(body);
  }

  update(body: any): Observable<ResponseDto<GetMovimientoModel>> {
    return this.#movimientoService.update(body);
  }
}
