import { Injectable, inject } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { MenuOptionsNavService } from '../../menu-options/services/menu-options-nav.service';
import { Observable, of, catchError } from 'rxjs';

/**
 * Servicio para inicializar la aplicación
 * Carga los permisos del usuario si hay una sesión activa
 */
@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {
  private authService = inject(AuthService);
  private menuOptionsNavService = inject(MenuOptionsNavService);

  /**
   * Inicializa la aplicación cargando los permisos si hay un token válido
   */
  initialize(): Observable<void> {
    const token = this.authService.getToken();
    
    // Si no hay token, no hacer nada
    if (!token) {
      return of(void 0);
    }

    // Si hay token, cargar permisos
    return this.menuOptionsNavService.loadUserPermissions().pipe(
      catchError((error) => {
        // Si falla la carga de permisos, no hacer nada
        // El usuario seguirá autenticado pero sin permisos cargados
        console.warn('No se pudieron cargar los permisos al inicializar:', error);
        return of(void 0);
      })
    );
  }
}
