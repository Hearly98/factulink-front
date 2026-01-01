# Guía de Autenticación para Frontend (Angular)

Esta guía detalla cómo implementar la autenticación en el frontend utilizando la API con **Laravel Sanctum**.

## 1. Endpoints de Autenticación

Todos los endpoints tienen el prefijo `/api/v1`.

| Método | Endpoint | Descripción | Acceso |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/login` | Iniciar sesión y obtener token | Público |
| `POST` | `/auth/register` | Registrar nuevo usuario | Público |
| `GET` | `/auth/me` | Obtener datos del usuario actual | Protegido (Bearer) |
| `POST` | `/auth/logout` | Revocar token actual | Protegido (Bearer) |

---

## 2. Implementación en Angular

### A. Estructura del Login
Cuando el usuario inicia sesión, la API devuelve un objeto con el token:

```json
{
  "user": { ... },
  "access_token": "1|abcdef123456...",
  "token_type": "Bearer"
}
```

Debes guardar el `access_token` en el `localStorage` o `sessionStorage`.

### B. Servicio de Autenticación (`auth.service.ts`)

```typescript
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => {
        localStorage.setItem('factu_token', res.access_token);
      })
    );
  }

  logout() {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => localStorage.removeItem('factu_token'))
    );
  }

  getUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/me`);
  }

  getToken(): string | null {
    return localStorage.getItem('factu_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
```

### C. HTTP Interceptor (`token.interceptor.ts`)
Para que Angular envíe el token en la cabecera `Authorization` de cada petición.

```typescript
import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('factu_token');

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  return next(req);
};
```

---

## 3. Pruebas con Swagger
Puedes probar estos endpoints directamente en la interfaz de Swagger de la API:
- URL: `http://localhost:8000/api/documentation`
- Para rutas protegidas, haz clic en el botón **"Authorize"** e ingresa el token obtenido en el login: `1|abcde...`

## 4. Manejo de Errores (401 Unauthorized)
Si el token expira o es inválido, la API devolverá un error `401`. Se recomienda capturar este error en un interceptor global para redirigir al usuario al login y limpiar el `localStorage`.
