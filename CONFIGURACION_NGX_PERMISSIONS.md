# Configuración de ngx-permissions

## 📦 Instalación

La librería `ngx-permissions` ya está instalada en el proyecto:

```json
"ngx-permissions": "^19.0.0"
```

Si necesitas instalarla en otro proyecto:

```bash
npm install ngx-permissions --save
```

## ⚙️ Configuración en Angular Standalone

### 1. Importar en app.config.ts

```typescript
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { NgxPermissionsModule } from 'ngx-permissions';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      NgxPermissionsModule.forRoot()
    ),
    // ... otros providers
  ]
};
```

### 2. Usar en Componentes

#### Importar Directivas

Para usar las directivas en componentes standalone:

```typescript
import { Component } from '@angular/core';
import { NgxPermissionsModule } from 'ngx-permissions';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [
    NgxPermissionsModule,
    // ... otros imports
  ],
  template: `
    <button *ngxPermissionsOnly="['ventas.create']">
      Crear Venta
    </button>
  `
})
export class MyComponent {}
```

#### Inyectar Servicio

```typescript
import { Component, inject } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-my-component',
  template: `...`
})
export class MyComponent {
  private permissionsService = inject(NgxPermissionsService);

  checkPermission() {
    const hasPermission = this.permissionsService.getPermission('ventas.create') !== undefined;
    console.log('Has permission:', hasPermission);
  }
}
```

## 🎯 Uso de Directivas

### *ngxPermissionsOnly

Muestra el elemento solo si el usuario tiene el permiso especificado:

```html
<!-- Mostrar si tiene UN permiso -->
<button *ngxPermissionsOnly="['ventas.create']">
  Crear Venta
</button>

<!-- Mostrar si tiene ALGUNO de los permisos -->
<button *ngxPermissionsOnly="['ventas.create', 'ventas.update']">
  Editar o Crear
</button>

<!-- Con else template -->
<div *ngxPermissionsOnly="['admin']; else noPermission">
  Contenido para admin
</div>
<ng-template #noPermission>
  <p>No tienes permisos</p>
</ng-template>
```

### *ngxPermissionsExcept

Muestra el elemento solo si el usuario NO tiene el permiso especificado:

```html
<!-- Ocultar si tiene el permiso -->
<div *ngxPermissionsExcept="['admin']">
  Contenido para no-admin
</div>

<!-- Ocultar si tiene ALGUNO de los permisos -->
<div *ngxPermissionsExcept="['admin', 'superadmin']">
  Contenido para usuarios normales
</div>
```

## 🔧 API del Servicio

### Cargar Permisos

```typescript
import { NgxPermissionsService } from 'ngx-permissions';

// Cargar permisos
this.permissionsService.loadPermissions(['ventas.create', 'ventas.list']);

// Cargar desde objeto
const permissions = {
  'ventas.create': {},
  'ventas.list': {},
  'ventas.update': {}
};
this.permissionsService.loadPermissions(Object.keys(permissions));
```

### Agregar Permiso

```typescript
// Agregar un permiso
this.permissionsService.addPermission('ventas.delete');

// Agregar múltiples permisos
this.permissionsService.addPermission(['compras.create', 'compras.list']);
```

### Eliminar Permiso

```typescript
// Eliminar un permiso
this.permissionsService.removePermission('ventas.delete');

// Eliminar múltiples permisos
this.permissionsService.removePermission(['compras.create', 'compras.list']);
```

### Verificar Permiso

```typescript
// Verificar si existe un permiso
const hasPermission = this.permissionsService.getPermission('ventas.create') !== undefined;

// Obtener todos los permisos
const allPermissions = this.permissionsService.getPermissions();
console.log(Object.keys(allPermissions)); // ['ventas.create', 'ventas.list', ...]
```

### Limpiar Permisos

```typescript
// Limpiar todos los permisos
this.permissionsService.flushPermissions();
```

## 🛡️ Guards con Permisos

### Crear Guard

```typescript
import { Injectable, inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
  private permissionsService = inject(NgxPermissionsService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredPermission = route.data['permission'] as string;
    
    if (!requiredPermission) {
      return true;
    }

    const hasPermission = this.permissionsService.getPermission(requiredPermission) !== undefined;
    
    if (!hasPermission) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}
```

### Usar en Rutas

```typescript
import { Routes } from '@angular/router';
import { PermissionGuard } from './guards/permission.guard';

export const routes: Routes = [
  {
    path: 'ventas',
    children: [
      {
        path: 'crear',
        component: CrearVentaComponent,
        canActivate: [PermissionGuard],
        data: { permission: 'ventas.create' }
      }
    ]
  }
];
```

## 🔄 Integración con el Sistema de Menús

### Cargar Permisos al Login

```typescript
// auth.service.ts
import { MenuOptionsNavService } from './menu-options/services/menu-options-nav.service';

login(credentials: any): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
    tap((res) => {
      this.setToken(res.access_token);
      this.setUser(res.user);
    }),
    switchMap((res) => {
      // Cargar permisos automáticamente
      return this.menuOptionsNavService.loadUserPermissions().pipe(
        map(() => res)
      );
    })
  );
}
```

### Cargar Menú Dinámico

```typescript
// default-layout.component.ts
import { MenuOptionsNavService } from './menu-options/services/menu-options-nav.service';

export class DefaultLayoutComponent implements OnInit {
  navItems = signal<INavData[]>([]);
  private menuOptionsNavService = inject(MenuOptionsNavService);

  ngOnInit() {
    this.menuOptionsNavService.listMenu().subscribe({
      next: (items) => {
        this.navItems.set(items);
      }
    });
  }
}
```

## 📚 Ejemplos Completos

### Componente con Permisos

```typescript
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, NgxPermissionsModule],
  template: `
    <div class="container">
      <h2>Ventas</h2>
      
      <!-- Botón visible solo con permiso -->
      <button 
        *ngxPermissionsOnly="['ventas.create']"
        class="btn btn-primary"
        (click)="crear()">
        Nueva Venta
      </button>

      <!-- Tabla con acciones condicionales -->
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Total</th>
            <th *ngxPermissionsOnly="['ventas.update', 'ventas.delete']">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          @for (venta of ventas(); track venta.id) {
            <tr>
              <td>{{ venta.id }}</td>
              <td>{{ venta.cliente }}</td>
              <td>{{ venta.total }}</td>
              <td *ngxPermissionsOnly="['ventas.update', 'ventas.delete']">
                <button 
                  *ngxPermissionsOnly="['ventas.update']"
                  (click)="editar(venta.id)">
                  Editar
                </button>
                <button 
                  *ngxPermissionsOnly="['ventas.delete']"
                  (click)="eliminar(venta.id)">
                  Eliminar
                </button>
              </td>
            </tr>
          }
        </tbody>
      </table>

      <!-- Mensaje si no tiene permisos -->
      <div *ngxPermissionsExcept="['ventas.list']">
        <p>No tienes permisos para ver las ventas</p>
      </div>
    </div>
  `
})
export class VentasComponent implements OnInit {
  private permissionsService = inject(NgxPermissionsService);
  ventas = signal<any[]>([]);
  canCreate = false;

  ngOnInit() {
    this.canCreate = this.permissionsService.getPermission('ventas.create') !== undefined;
    this.loadVentas();
  }

  crear() {
    if (!this.canCreate) {
      alert('No tienes permiso');
      return;
    }
    // Lógica para crear
  }

  editar(id: number) {
    // Lógica para editar
  }

  eliminar(id: number) {
    // Lógica para eliminar
  }

  loadVentas() {
    // Cargar ventas
  }
}
```

## 🐛 Troubleshooting

### Error: No provider for NgxPermissionsService

**Solución:** Asegúrate de importar `NgxPermissionsModule.forRoot()` en `app.config.ts`:

```typescript
importProvidersFrom(
  NgxPermissionsModule.forRoot()
)
```

### Las directivas no funcionan

**Solución:** Importa `NgxPermissionsModule` en tu componente standalone:

```typescript
@Component({
  imports: [NgxPermissionsModule]
})
```

### Los permisos no se cargan

**Solución:** Verifica que estés llamando a `loadUserPermissions()` después del login:

```typescript
this.menuOptionsNavService.loadUserPermissions().subscribe();
```

## 📖 Documentación Oficial

- [ngx-permissions GitHub](https://github.com/AlexKhymenko/ngx-permissions)
- [ngx-permissions Docs](https://github.com/AlexKhymenko/ngx-permissions/blob/master/README.md)

## ✅ Checklist de Configuración

- [x] `ngx-permissions` instalado en package.json
- [x] `NgxPermissionsModule.forRoot()` importado en app.config.ts
- [x] Servicio `MenuOptionsNavService` carga permisos al login
- [x] Guard `PermissionGuard` creado para proteger rutas
- [x] Directivas `*ngxPermissionsOnly` y `*ngxPermissionsExcept` disponibles
- [x] Documentación y ejemplos creados
