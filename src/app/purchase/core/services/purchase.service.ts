import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { BaseService } from '@shared/services/base.service';
import { PurchaseCreateDto } from '../purchase-create-dto';
import { Observable } from 'rxjs';
import { ResponseDto } from '@shared/models/api/response.dto';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService extends BaseService {
  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/compras`);
  }

  create(body: PurchaseCreateDto): Observable<ResponseDto<any>> {
    return this.postRequest(`/`, body);
  }
}
