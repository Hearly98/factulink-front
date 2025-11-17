import { Injectable } from '@angular/core';
import { BaseService } from '../../../shared/services/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseDto } from '../../../shared/models/api/response.dto';
import { GetUnitOfMeasureModel } from '../models';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UnitOfMeasureService extends BaseService {
  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/unidades`);
  }

  getAll(): Observable<ResponseDto<GetUnitOfMeasureModel[]>> {
    return this.getRequest<ResponseDto<GetUnitOfMeasureModel[]>>('');
  }

  getById(id: number): Observable<ResponseDto<GetUnitOfMeasureModel>> {
    return this.getRequest<ResponseDto<GetUnitOfMeasureModel>>(`/${id}`);
  }
}
