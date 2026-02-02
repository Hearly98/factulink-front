# Sistema de Menús y Permisos - Frontend Angular

## 📋 Descripción

Este módulo maneja el sistema de menús dinámicos y permisos basado en roles del usuario. Se integra con el backend para obtener el menú jerárquico y los permisos del usuario autenticado.

## ⚙️ Configuración Inicial

### 1. Instalar ngx-permissions (ya instalado)

```bash
npm install ngx-permissions --save
```

### 2. Configurar en app.config.ts

```typescript
import { importProvidersFrom } from '@angular/core';
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

✅ **Ya está configurado en tu proyecto**

## 🏗️ Estructura

```
menu-options/
├── models/
│   └── menu-option.dto.ts          # DTO del menú
├── services/
│   ├── menu-options.service.ts     # Servicio para API de permisos
│   └── menu-options-nav.service.ts # Servicio para navegación
└── README.md
```

## 🔧 Servicios

### MenuOptionsService

Servicio que se comunica con el backend para obtener menús y permisos.

**Métodos:**

- `listTree()`: Obtiene el menú jerárquico del usuario
- `getUserPermissions()`: Obtiene los códigos de permisos del usuario
- `checkPermission(actionCode)`: Verifica si el usuario tiene un permiso específico

### MenuOptionsNavService

Servicio que transforma los datos del backend en formato compatible con CoreUI.

**Métodos:**

- `loadUserPermissions()`: Carga los permisos en ngx-permissions
- `listMenu()`: Obtiene el menú formateado para CoreUI

## 🚀 Uso

### 1. Cargar Permisos al Iniciar Sesión

Los permisos se cargan automáticamente en el `AuthService` después del login:

```typescript
// Ya está implementado en auth.service.ts
login(credentials: any): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
    tap((res) => {
      this.setToken(res.access_token);
      this.setUser(res.user);
    }),
    switchMap((res) => {
      // Cargar permisos después del login
      return this.menuOptionsNavService.loadUserPermissions().pipe(
        map(() => res)
      );
    })
  );
}
```

### 2. Renderizar Menú en Layout

El menú se carga automáticamente en el `DefaultLayoutComponent`:

```typescript
// Ya está implementado en default-layout.component.ts
export class DefaultLayoutComponent implements OnInit {
  public navItems = signal<INavData[]>([]);

  constructor(private menuOptionsNavService: MenuOptionsNavService) {}

  ngOnInit() {
    this.menuOptionsNavService.listMenu().subscribe({
      next: (items) => {
        this.navItems.set(items);
      }
    });
  }
}
```

### 3. Usar Permisos en Templates

```html
<!-- Mostrar botón solo si tiene permiso -->
<button *ngxPermissionsOnly="['ventas.create']">
  Crear Venta
</button>

<!-- Mostrar sección si tiene alguno de los permisos -->
<div *ngxPermissionsOnly="['ventas.view', 'ventas.list']">
  <h3>Ventas</h3>
</div>

<!-- Ocultar si tiene permiso -->
<div *ngxPermissionsExcept="['ventas.delete']">
  <p>No puedes eliminar ventas</p>
</div>
```

### 4. Verificar Permisos en Componentes

```typescript
import { Component, OnInit } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html'
})
export class VentasComponent implements OnInit {
  canCreate = false;
  canDelete = false;

  constructor(private permissionsService: NgxPermissionsService) {}

  ngOnInit() {
    this.canCreate = this.permissionsService.getPermission('ventas.create') !== undefined;
    this.canDelete = this.permissionsService.getPermission('ventas.delete') !== undefined;
  }

  createVenta() {
    if (!this.canCreate) {
      alert('No tienes permiso para crear ventas');
      return;
    }
    // Lógica para crear venta
  }
}
```

### 5. Proteger Rutas con Guards

```typescript
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
  constructor(
    private permissionsService: NgxPermissionsService,
    private router: Router
  ) {}

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

**Uso en rutas:**

```typescript
const routes: Routes = [
  {
    path: 'ventas/crear',
    component: CrearVentaComponent,
    canActivate: [PermissionGuard],
    data: { permission: 'ventas.create' }
  }
];
```

## 📊 Estructura de Datos

### MenuOptionDto

```typescript
export class MenuOptionDto {
  id: number;
  code: string;
  name: string;
  description?: string;
  menuUri: string | null;
  menuIcon: string | null;
  sortOrder: number;
  actionCode: string | null;
  children: MenuOptionDto[];
}
```

### Respuesta del Backend

```json
{
  "data": [
    {
      "id": 1,
      "code": "menu.ventas",
      "name": "Ventas",
      "menuUri": "/ventas",
      "menuIcon": "shopping-cart",
      "sortOrder": 1,
      "actionCode": "ventas.list",
      "children": []
    }
  ],
  "isValid": true,
  "messages": [],
  "errors": []
}
```

## 🔐 Códigos de Permisos Comunes

- `ventas.list` - Listar ventas
- `ventas.create` - Crear venta
- `ventas.view` - Ver detalle de venta
- `ventas.update` - Actualizar venta
- `ventas.delete` - Eliminar venta
- `ventas.pdf` - Generar PDF de venta
- `compras.list` - Listar compras
- `productos.list` - Listar productos
- `clientes.list` - Listar clientes
- `usuarios.list` - Listar usuarios
- `roles.manage` - Gestionar roles

## 🎯 Flujo Completo

1. **Login**: Usuario inicia sesión
2. **Carga de Permisos**: `AuthService` carga permisos automáticamente
3. **Carga de Menú**: `DefaultLayoutComponent` obtiene el menú del backend
4. **Renderizado**: El menú se muestra según los permisos del usuario
5. **Protección**: Guards y directivas protegen rutas y elementos

## 📝 Notas

- Los permisos se almacenan en `ngx-permissions` para uso global
- El menú se cachea en `sessionStorage` para mejorar el rendimiento
- Al hacer logout, se limpia el caché del menú
- El backend filtra automáticamente el menú según los permisos del usuario

## 🐛 Troubleshooting

### El menú no se muestra

1. Verificar que el usuario tenga permisos asignados en el backend
2. Revisar la consola del navegador para errores
3. Verificar que el token de autenticación sea válido

### Los permisos no funcionan

1. Verificar que `loadUserPermissions()` se haya ejecutado
2. Revisar que los códigos de permisos coincidan con el backend
3. Verificar que `ngx-permissions` esté correctamente configurado

### El menú no se actualiza

1. Limpiar el `sessionStorage`: `sessionStorage.removeItem('menuConfig')`
2. Hacer logout y volver a iniciar sesión
3. Forzar actualización: `sessionStorage.setItem('updateMenuConfig', 'true')`
