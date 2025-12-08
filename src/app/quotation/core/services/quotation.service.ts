import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseDto } from '@shared/models/api/response.dto';
import { QuotationModel } from '../models/quotation.model';
import { PageParamsModel } from '@shared/models/query/page-params.model';
import { SerieModel } from 'src/app/series/core/models/serie.model';

@Injectable({
  providedIn: 'root',
})
export class QuotationService {
  #http = inject(HttpClient);
  #apiUrl = `${environment.apiUrl}/cotizaciones`;

  search(params: PageParamsModel): Observable<ResponseDto<{ items: QuotationModel[]; total: number }>> {
    return this.#http.post<ResponseDto<{ items: QuotationModel[]; total: number }>>(
      `${this.#apiUrl}/search`,
      params
    );
  }

  getSeries(): Observable<ResponseDto<SerieModel[]>> {
    return this.#http.get<ResponseDto<SerieModel[]>>(`${this.#apiUrl}/series`);
  }

  getById(id: number): Observable<ResponseDto<QuotationModel>> {
    return this.#http.get<ResponseDto<QuotationModel>>(`${this.#apiUrl}/${id}`);
  }

  create(data: any): Observable<ResponseDto<QuotationModel>> {
    return this.#http.post<ResponseDto<QuotationModel>>(this.#apiUrl, data);
  }

  delete(id: number): Observable<ResponseDto<void>> {
    return this.#http.delete<ResponseDto<void>>(`${this.#apiUrl}/${id}`);
  }
}
