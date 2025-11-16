import { Injectable } from '@angular/core';
import { BaseService } from '../../../shared/services/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseDto } from '../../../shared/models/api/response.dto';
import { GetUnidadModel } from '../models';

@Injectable({
  providedIn: 'root',
})
export class UnidadService extends BaseService {
  constructor(http: HttpClient) {
    super(http, 'http://localhost:8000/api/v1/unidades');
  }

  getAll(): Observable<ResponseDto<GetUnidadModel[]>> {
    return this.getRequest<ResponseDto<GetUnidadModel[]>>('');
  }

  getById(id: number): Observable<ResponseDto<GetUnidadModel>> {
    return this.getRequest<ResponseDto<GetUnidadModel>>(`/${id}`);
  }
}

