import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseDto } from '@shared/models/api/response.dto';
import { environment } from '@environments/environment';
import { MenuOptionDto } from '../models/menu-option.dto';

@Injectable({
  providedIn: 'root'
})
export class MenuOptionsService {
  private apiUrl = `${environment.apiUrl}/permissions`;

  constructor(private http: HttpClient) {}

  /**
   * Obtener menú en formato tree (jerárquico) basado en permisos del usuario
   */
  listTree(): Observable<ResponseDto<MenuOptionDto[]>> {
    return this.http.get<ResponseDto<MenuOptionDto[]>>(`${this.apiUrl}/menu`);
  }

  /**
   * Obtener permisos del usuario (códigos de acción)
   */
  getUserPermissions(): Observable<ResponseDto<string[]>> {
    return this.http.get<ResponseDto<string[]>>(`${this.apiUrl}/user-permissions`);
  }

  /**
   * Verificar si el usuario tiene un permiso específico
   */
  checkPermission(actionCode: string): Observable<ResponseDto<{ has_permission: boolean; action_code: string }>> {
    return this.http.post<ResponseDto<any>>(`${this.apiUrl}/check`, { action_code: actionCode });
  }
}
