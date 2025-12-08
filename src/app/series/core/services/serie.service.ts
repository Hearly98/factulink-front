import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponseDto } from '@shared/models/api/response.dto';
import { SerieModel } from '../models/serie.model';
import { PageParamsModel } from '@shared/models/query/page-params.model';

@Injectable({
  providedIn: 'root',
})
export class SerieService {
  #http = inject(HttpClient);
  #apiUrl = `${environment.apiUrl}/series`;

  search(params: PageParamsModel): Observable<ResponseDto<{ items: SerieModel[]; total: number }>> {
    return this.#http.post<ResponseDto<{ items: SerieModel[]; total: number }>>(
      `${this.#apiUrl}/search`,
      params
    );
  }

  getAll(): Observable<ResponseDto<SerieModel[]>> {
    return this.#http.get<ResponseDto<SerieModel[]>>(this.#apiUrl);
  }

  getById(id: number): Observable<ResponseDto<SerieModel>> {
    return this.#http.get<ResponseDto<SerieModel>>(`${this.#apiUrl}/${id}`);
  }

  create(data: Partial<SerieModel>): Observable<ResponseDto<SerieModel>> {
    return this.#http.post<ResponseDto<SerieModel>>(this.#apiUrl, data);
  }

  update(id: number, data: Partial<SerieModel>): Observable<ResponseDto<SerieModel>> {
    return this.#http.put<ResponseDto<SerieModel>>(`${this.#apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<ResponseDto<void>> {
    return this.#http.delete<ResponseDto<void>>(`${this.#apiUrl}/${id}`);
  }
}
