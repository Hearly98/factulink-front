import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import { Observable } from 'rxjs';

/**
 * Guard para proteger rutas basado en permisos del usuario
 * 
 * Uso en rutas:
 * ```typescript
 * {
 *   path: 'ventas/crear',
 *   component: CrearVentaComponent,
 *   canActivate: [PermissionGuard],
 *   data: { permission: 'ventas.create' }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
  private permissionsService = inject(NgxPermissionsService);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const requiredPermission = route.data['permission'] as string;
    
    // Si no se especifica permiso, permitir acceso
    if (!requiredPermission) {
      return true;
    }

    // Verificar si el usuario tiene el permiso
    const hasPermission = this.permissionsService.getPermission(requiredPermission) !== undefined;
    
    if (!hasPermission) {
      console.warn(`Acceso denegado: permiso '${requiredPermission}' requerido`);
      // Redirigir a página de no autorizado
      return this.router.createUrlTree(['/unauthorized']);
    }

    return true;
  }
}
