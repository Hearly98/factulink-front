# Solución: Dependencia Circular en AuthService

## ❌ Error Original

```
ERROR RuntimeError: NG0200: Circular dependency detected for `_AuthService`
```

## 🔍 Causa del Problema

La dependencia circular ocurría en este flujo:

```
1. authInterceptor inyecta AuthService
   ↓
2. AuthService inyecta MenuOptionsNavService
   ↓
3. MenuOptionsNavService inyecta HttpClient
   ↓
4. HttpClient usa authInterceptor
   ↓
5. CICLO: authInterceptor necesita AuthService (paso 1)
```

### Diagrama del Problema

```
authInterceptor → AuthService → MenuOptionsNavService → HttpClient → authInterceptor
     ↑                                                                      ↓
     └──────────────────────────────────────────────────────────────────────┘
                            DEPENDENCIA CIRCULAR
```

## ✅ Solución Aplicada

### 1. Eliminar Inyección de MenuOptionsNavService en AuthService

**Antes (con dependencia circular):**

```typescript
// auth.service.ts
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private menuOptionsNavService = inject(MenuOptionsNavService); // ❌ Causa circular

  constructor() {
    const token = this.getToken();
    if (token) {
      // ❌ Esto causa el problema
      this.menuOptionsNavService.loadUserPermissions().subscribe();
    }
  }

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        this.setToken(res.access_token);
        this.setUser(res.user);
      }),
      switchMap((res) => {
        // ❌ Esto también causa el problema
        return this.menuOptionsNavService.loadUserPermissions().pipe(
          map(() => res)
        );
      })
    );
  }
}
```

**Después (sin dependencia circular):**

```typescript
// auth.service.ts
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // ✅ NO inyectar MenuOptionsNavService aquí

  constructor() {
    const token = this.getToken();
    if (token) {
      // ✅ NO cargar permisos aquí
      this._user.set(JSON.parse(storedUser));
    }
  }

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        this.setToken(res.access_token);
        this.setUser(res.user);
      })
      // ✅ NO cargar permisos aquí
    );
  }
}
```

### 2. Cargar Permisos en el Componente de Login

**Archivo:** `src/app/login/login.component.ts`

```typescript
import { MenuOptionsNavService } from '../menu-options/services/menu-options-nav.service';
import { switchMap } from 'rxjs';

export class LoginComponent {
  private authService = inject(AuthService);
  private menuOptionsNavService = inject(MenuOptionsNavService);

  onLogin() {
    if (this.form.invalid) return;

    this.isLoading.set(true);
    
    // ✅ Cargar permisos DESPUÉS del login, en el componente
    this.authService.login(this.form.value).pipe(
      switchMap(() => {
        // Cargar permisos después del login exitoso
        return this.menuOptionsNavService.loadUserPermissions();
      })
    ).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        console.error('Login error', err);
      }
    });
  }
}
```

## 🎯 Flujo Correcto

### Nuevo Flujo (Sin Dependencia Circular)

```
1. Usuario hace login
   ↓
2. LoginComponent llama authService.login()
   ↓
3. AuthService guarda token y usuario
   ↓
4. LoginComponent llama menuOptionsNavService.loadUserPermissions()
   ↓
5. MenuOptionsNavService carga permisos del backend
   ↓
6. Permisos se cargan en NgxPermissionsService
   ↓
7. Usuario es redirigido al dashboard
```

### Diagrama del Flujo Correcto

```
LoginComponent
    ↓
    ├─→ AuthService.login()
    │       ↓
    │   Guarda token
    │       ↓
    └─→ MenuOptionsNavService.loadUserPermissions()
            ↓
        Carga permisos
            ↓
        Navega a /dashboard
```

## 📝 Archivos Modificados

### 1. auth.service.ts

**Cambios:**
- ✅ Eliminada inyección de `MenuOptionsNavService`
- ✅ Eliminada carga de permisos en constructor
- ✅ Eliminada carga de permisos en método `login()`
- ✅ Eliminada carga de permisos en método `register()`

### 2. login.component.ts

**Cambios:**
- ✅ Agregada inyección de `MenuOptionsNavService`
- ✅ Agregada carga de permisos después del login exitoso
- ✅ Uso de `switchMap` para encadenar observables

## 🔧 Patrón de Diseño

Este patrón se llama **"Lazy Loading"** o **"Deferred Initialization"**:

- Los servicios no se inyectan en el constructor si pueden causar dependencias circulares
- La inicialización se hace de forma "perezosa" (lazy) cuando realmente se necesita
- Se delega la responsabilidad al componente que tiene el contexto adecuado

## ✅ Ventajas de esta Solución

1. **Sin dependencia circular**: Los servicios no se inyectan entre sí
2. **Separación de responsabilidades**: Cada servicio tiene una responsabilidad clara
3. **Más control**: El componente controla cuándo cargar los permisos
4. **Mejor manejo de errores**: Errores de carga de permisos no afectan el login
5. **Más testeable**: Cada parte se puede testear independientemente

## 🚀 Aplicar en Otros Componentes

Si tienes otros componentes que necesitan cargar permisos (como registro), aplica el mismo patrón:

```typescript
// register.component.ts
export class RegisterComponent {
  private authService = inject(AuthService);
  private menuOptionsNavService = inject(MenuOptionsNavService);

  onRegister() {
    this.authService.register(this.form.value).pipe(
      switchMap(() => {
        return this.menuOptionsNavService.loadUserPermissions();
      })
    ).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Register error', err);
      }
    });
  }
}
```

## 📚 Recursos

- [Angular Dependency Injection](https://angular.dev/guide/di)
- [Circular Dependencies](https://angular.dev/errors/NG0200)
- [RxJS switchMap](https://rxjs.dev/api/operators/switchMap)

## ⚠️ Notas Importantes

1. **No inyectar servicios que usan HttpClient en servicios que son usados por interceptores**
2. **Cargar datos adicionales (como permisos) en componentes, no en servicios de autenticación**
3. **Usar `switchMap` para encadenar observables que dependen uno del otro**
4. **Manejar errores apropiadamente en cada paso del flujo**

## 🎉 Resultado

El error de dependencia circular está resuelto. El flujo de autenticación y carga de permisos ahora funciona correctamente sin dependencias circulares.
