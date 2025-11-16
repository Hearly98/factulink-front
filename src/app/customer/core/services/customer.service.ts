import { Injectable } from '@angular/core';
import { BaseService } from '../../../shared/services/base.service';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CustomerService extends BaseService {
  constructor(http: HttpClient) {
    super(http, `${environment.apiUrl}/clientes`);
  }
}
