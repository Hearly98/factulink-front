import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseDto } from '@shared/models/api/response.dto';
import { ShippingGuideModel } from '../models/shipping-guide.model';
import { PageParamsModel } from '@shared/models/query/page-params.model';
import { SerieModel } from 'src/app/series/core/models/serie.model';

@Injectable({
  providedIn: 'root',
})
export class ShippingGuideService {
  #http = inject(HttpClient);
  #apiUrl = `${environment.apiUrl}/guias-remision`;

  search(params: PageParamsModel): Observable<ResponseDto<{ items: ShippingGuideModel[]; total: number }>> {
    return this.#http.post<ResponseDto<{ items: ShippingGuideModel[]; total: number }>>(
      `${this.#apiUrl}/search`,
      params
    );
  }

  getSeries(): Observable<ResponseDto<SerieModel[]>> {
    return this.#http.get<ResponseDto<SerieModel[]>>(`${this.#apiUrl}/series`);
  }

  getById(id: number): Observable<ResponseDto<ShippingGuideModel>> {
    return this.#http.get<ResponseDto<ShippingGuideModel>>(`${this.#apiUrl}/${id}`);
  }

  create(data: any): Observable<ResponseDto<ShippingGuideModel>> {
    return this.#http.post<ResponseDto<ShippingGuideModel>>(this.#apiUrl, data);
  }

  delete(id: number): Observable<ResponseDto<void>> {
    return this.#http.delete<ResponseDto<void>>(`${this.#apiUrl}/${id}`);
  }
}
