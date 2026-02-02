# Solución: Persistencia de Sesión al Recargar la Página

## ❌ Problema Original

Al recargar la página, el `localStorage` se borraba y el usuario perdía su sesión, teniendo que iniciar sesión nuevamente.

## 🔍 Causa del Problema

En el constructor de `AuthService`, se estaba verificando el usuario con el backend al inicializar:

```typescript
constructor() {
  const token = this.getToken();
  
  if (token) {
    // ❌ Esto causaba que se borrara el localStorage al recargar
    this.getUser().subscribe({
      error: () => this.logoutLocal() // Borraba todo si fallaba
    });
  }
}
```

### Flujo del Problema

```
1. Usuario recarga la página
   ↓
2. AuthService se inicializa
   ↓
3. Encuentra token en localStorage
   ↓
4. Llama a getUser() para verificar
   ↓
5. Si falla (red lenta, backend caído, etc.)
   ↓
6. Ejecuta logoutLocal()
   ↓
7. ❌ Borra localStorage y redirige a login
```

## ✅ Solución Aplicada

### 1. Eliminar Verificación Automática en Constructor

**Archivo:** `src/app/core/auth/services/auth.service.ts`

```typescript
constructor() {
  // Try to load user if token and stored user exist
  const token = this.getToken();
  const storedUser = localStorage.getItem(this.USER_KEY);

  if (token && storedUser) {
    try {
      this._user.set(JSON.parse(storedUser));
      // ✅ NO verificar con el backend aquí
    } catch (e) {
      // Solo limpiar si hay error al parsear el usuario
      localStorage.removeItem(this.USER_KEY);
    }
  }

  // ✅ NO verificar el usuario al inicializar
  // La verificación se hará cuando sea necesario (en guards o al navegar)
}
```

### 2. Crear Servicio de Inicialización

**Archivo:** `src/app/core/services/app-initializer.service.ts`

```typescript
import { Injectable, inject } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { MenuOptionsNavService } from '../../menu-options/services/menu-options-nav.service';
import { Observable, of, catchError } from 'rxjs';

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
        // Si falla, no hacer nada - el usuario seguirá autenticado
        console.warn('No se pudieron cargar los permisos al inicializar:', error);
        return of(void 0);
      })
    );
  }
}
```

### 3. Configurar APP_INITIALIZER

**Archivo:** `src/app/app.config.ts`

```typescript
import { APP_INITIALIZER } from '@angular/core';
import { AppInitializerService } from './core/services/app-initializer.service';

/**
 * Factory function para inicializar la aplicación
 */
export function initializeApp(appInitializer: AppInitializerService) {
  return () => appInitializer.initialize();
}

export const appConfig: ApplicationConfig = {
  providers: [
    // ... otros providers
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AppInitializerService],
      multi: true
    }
  ]
};
```

## 🎯 Nuevo Flujo (Correcto)

### Al Recargar la Página

```
1. Usuario recarga la página
   ↓
2. AuthService se inicializa
   ↓
3. Carga token y usuario desde localStorage
   ↓
4. ✅ NO verifica con el backend
   ↓
5. APP_INITIALIZER ejecuta AppInitializerService
   ↓
6. Si hay token, carga permisos
   ↓
7. Si falla la carga de permisos, NO borra localStorage
   ↓
8. ✅ Usuario mantiene su sesión
```

### Al Navegar con Guard

```
1. Usuario intenta acceder a ruta protegida
   ↓
2. authGuard verifica isAuthenticated()
   ↓
3. Si hay token, permite acceso
   ↓
4. Si no hay token, redirige a login
```

## 📊 Comparación

### Antes (Problema)

| Escenario | Resultado |
|-----------|-----------|
| Recargar página con red lenta | ❌ Pierde sesión |
| Recargar página con backend caído | ❌ Pierde sesión |
| Recargar página sin internet | ❌ Pierde sesión |
| Token expirado | ❌ Pierde sesión inmediatamente |

### Después (Solución)

| Escenario | Resultado |
|-----------|-----------|
| Recargar página con red lenta | ✅ Mantiene sesión |
| Recargar página con backend caído | ✅ Mantiene sesión |
| Recargar página sin internet | ✅ Mantiene sesión |
| Token expirado | ✅ Mantiene sesión hasta que intente hacer una petición |

## 🔐 Seguridad

### ¿Es seguro mantener la sesión sin verificar?

**Sí**, porque:

1. **El token se verifica en cada petición**: El `authInterceptor` envía el token en cada request
2. **El backend valida el token**: Si el token es inválido, el backend responde con 401
3. **El interceptor maneja 401**: Cuando recibe 401, ejecuta `logoutLocal()`
4. **Verificación lazy**: La verificación se hace cuando realmente se necesita

### Flujo de Seguridad

```
Usuario hace petición
    ↓
authInterceptor agrega token
    ↓
Backend valida token
    ↓
Si token inválido → 401
    ↓
errorInterceptor detecta 401
    ↓
Ejecuta logoutLocal()
    ↓
Borra localStorage y redirige a login
```

## 📝 Archivos Modificados

1. **src/app/core/auth/services/auth.service.ts**
   - Eliminada verificación automática en constructor
   - Mantiene carga de usuario desde localStorage

2. **src/app/core/services/app-initializer.service.ts** (nuevo)
   - Servicio para inicializar la aplicación
   - Carga permisos si hay token válido
   - Maneja errores sin borrar localStorage

3. **src/app/app.config.ts**
   - Agregado APP_INITIALIZER
   - Configura inicialización de la aplicación

## ✅ Ventajas de esta Solución

1. **Persistencia de sesión**: El usuario no pierde su sesión al recargar
2. **Mejor UX**: No requiere login constante
3. **Manejo de errores robusto**: Errores de red no afectan la sesión
4. **Seguridad mantenida**: El token se valida en cada petición
5. **Carga de permisos automática**: Los permisos se cargan al iniciar si hay sesión
6. **Offline-friendly**: Funciona mejor con conexiones inestables

## 🚀 Casos de Uso

### Caso 1: Usuario con Sesión Activa Recarga la Página

```
✅ Mantiene sesión
✅ Carga permisos automáticamente
✅ Puede seguir navegando
```

### Caso 2: Usuario sin Internet Recarga la Página

```
✅ Mantiene sesión
⚠️ No puede cargar permisos (pero no pierde sesión)
✅ Puede ver páginas cacheadas
```

### Caso 3: Token Expirado

```
✅ Mantiene sesión temporalmente
❌ Primera petición al backend devuelve 401
✅ errorInterceptor ejecuta logout
✅ Usuario es redirigido a login
```

## 🎯 Mejoras Futuras (Opcionales)

### 1. Refresh Token

Implementar refresh token para renovar tokens expirados automáticamente:

```typescript
// En authInterceptor
if (error.status === 401) {
  // Intentar renovar token
  return this.authService.refreshToken().pipe(
    switchMap(() => {
      // Reintentar petición original
      return next(req);
    }),
    catchError(() => {
      // Si falla, hacer logout
      this.authService.logoutLocal();
      return throwError(() => error);
    })
  );
}
```

### 2. Verificación Periódica

Verificar el token periódicamente en background:

```typescript
// En AppInitializerService
setInterval(() => {
  if (this.authService.getToken()) {
    this.authService.getUser().subscribe({
      error: () => this.authService.logoutLocal()
    });
  }
}, 5 * 60 * 1000); // Cada 5 minutos
```

### 3. Expiración Local

Guardar fecha de expiración del token y verificar localmente:

```typescript
isTokenExpired(): boolean {
  const expiration = localStorage.getItem('token_expiration');
  if (!expiration) return true;
  return Date.now() > parseInt(expiration);
}
```

## 📚 Recursos

- [Angular APP_INITIALIZER](https://angular.dev/api/core/APP_INITIALIZER)
- [LocalStorage Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [JWT Token Management](https://jwt.io/introduction)

## 🎉 Resultado

El localStorage ahora persiste correctamente al recargar la página. Los usuarios mantienen su sesión y no necesitan iniciar sesión constantemente, mejorando significativamente la experiencia de usuario.
