import { Injectable } from '@angular/core';
import { BaseService } from '../../../shared/services/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryModel } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService extends BaseService{
  constructor(http: HttpClient) {
    super(http, 'http://localhost:8000/api/v1/categorias');
  }

  getAll():Observable<CategoryModel[]> {
    return this.getRequest('');
  }
}
