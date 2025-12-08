import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseDto } from '@shared/models/api/response.dto';
import { SaleModel } from '../models/sale.model';
import { PageParamsModel } from '@shared/models/query/page-params.model';
import { SerieModel } from 'src/app/series/core/models/serie.model';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  #http = inject(HttpClient);
  #apiUrl = `${environment.apiUrl}/ventas`;

  search(params: PageParamsModel): Observable<ResponseDto<{ items: SaleModel[]; total: number }>> {
    return this.#http.post<ResponseDto<{ items: SaleModel[]; total: number }>>(
      `${this.#apiUrl}/search`,
      params
    );
  }

  getSeriesByDocType(docId: number): Observable<ResponseDto<SerieModel[]>> {
    return this.#http.get<ResponseDto<SerieModel[]>>(`${this.#apiUrl}/series/${docId}`);
  }

  getById(id: number): Observable<ResponseDto<SaleModel>> {
    return this.#http.get<ResponseDto<SaleModel>>(`${this.#apiUrl}/${id}`);
  }

  create(data: any): Observable<ResponseDto<SaleModel>> {
    return this.#http.post<ResponseDto<SaleModel>>(this.#apiUrl, data);
  }

  delete(id: number): Observable<ResponseDto<void>> {
    return this.#http.delete<ResponseDto<void>>(`${this.#apiUrl}/${id}`);
  }
}
