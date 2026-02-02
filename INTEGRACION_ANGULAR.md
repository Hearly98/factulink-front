# Integración con Angular Frontend

## 📋 Endpoints Disponibles

### 1. Obtener Menú del Usuario (Tree)

```http
GET /api/permissions/menu
Authorization: Bearer {token}
```

**Respuesta:**
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
    },
    {
      "id": 3,
      "code": "menu.inventario",
      "name": "Inventario",
      "menuUri": null,
      "menuIcon": "package",
      "sortOrder": 3,
      "actionCode": null,
      "children": [
        {
          "id": 4,
          "code": "menu.inventario.productos",
          "name": "Productos",
          "menuUri": "/productos",
          "menuIcon": null,
          "sortOrder": 1,
          "actionCode": "productos.list",
          "children": []
        },
        {
          "id": 5,
          "code": "menu.inventario.stock",
          "name": "Control de Stock",
          "menuUri": "/stock",
          "menuIcon": null,
          "sortOrder": 2,
          "actionCode": "stock.view",
          "children": []
        }
      ]
    }
  ],
  "isValid": true,
  "messages": [
    {
      "key": null,
      "message": "Menú obtenido exitosamente",
      "messageType": 0
    }
  ],
  "errors": []
}
```

### 2. Obtener Permisos del Usuario (Códigos)

```http
GET /api/permissions/user-permissions
Authorization: Bearer {token}
```

**Respuesta:**
```json
{
  "data": [
    "ventas.list",
    "ventas.create",
    "ventas.view",
    "ventas.pdf",
    "clientes.list",
    "clientes.create",
    "productos.list",
    "stock.view"
  ],
  "isValid": true,
  "messages": [
    {
      "key": null,
      "message": "Permisos obtenidos exitosamente",
      "messageType": 0
    }
  ],
  "errors": []
}
```

### 3. Verificar Permiso Específico

```http
POST /api/permissions/check
Authorization: Bearer {token}
Content-Type: application/json

{
  "action_code": "ventas.create"
}
```

**Respuesta:**
```json
{
  "data": {
    "has_permission": true,
    "action_code": "ventas.create"
  },
  "isValid": true,
  "messages": [
    {
      "key": null,
      "message": "Usuario tiene permiso",
      "messageType": 0
    }
  ],
  "errors": []
}
```

---

## 🔧 Adaptación del Servicio Angular

### Actualizar MenuOptionsService

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

export interface MenuOptionDto {
  id: number;
  code: string;
  name: string;
  menuUri: string | null;
  menuIcon: string | null;
  sortOrder: number;
  actionCode: string | null;
  children: MenuOptionDto[];
}

export interface ApiResponse<T> {
  data: T;
  isValid: boolean;
  messages: Array<{
    key: string | null;
    message: string;
    messageType: number;
  }>;
  errors: any[];
}

@Injectable({
  providedIn: 'root'
})
export class MenuOptionsService {
  private apiUrl = `${environment.apiUrl}/permissions`;

  constructor(private http: HttpClient) {}

  /**
   * Obtener menú en formato tree (jerárquico)
   */
  listTree(): Observable<ApiResponse<MenuOptionDto[]>> {
    return this.http.get<ApiResponse<MenuOptionDto[]>>(`${this.apiUrl}/menu`);
  }

  /**
   * Obtener permisos del usuario (códigos de acción)
   */
  getUserPermissions(): Observable<ApiResponse<string[]>> {
    return this.http.get<ApiResponse<string[]>>(`${this.apiUrl}/user-permissions`);
  }

  /**
   * Verificar si el usuario tiene un permiso específico
   */
  checkPermission(actionCode: string): Observable<ApiResponse<{ has_permission: boolean; action_code: string }>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/check`, { action_code: actionCode });
  }
}
```

---

## 🎯 Actualizar MenuOptionsNavService

```typescript
import { Injectable } from "@angular/core";
import { MenuOptionsService, MenuOptionDto } from "./menu-options.service";
import { INavData } from "@coreui/angular";
import { Observable, map, of, forkJoin } from "rxjs";
import { navItems } from "@base/containers/default-layout/_nav";
import { environment } from "@environments/environment";
import { TranslateService } from "@ngx-translate/core";
import { NgxPermissionsService } from "ngx-permissions";

@Injectable()
export class MenuOptionsNavService {
  private enableTitle = false;

  constructor(
    private translate: TranslateService,
    private menuOptionsService: MenuOptionsService,
    private ngxPermissionsService: NgxPermissionsService
  ) {}

  /**
   * Cargar permisos del usuario en ngx-permissions
   */
  loadUserPermissions(): Observable<void> {
    return this.menuOptionsService.getUserPermissions().pipe(
      map((response) => {
        if (response.isValid && response.data) {
          // Cargar permisos en ngx-permissions
          const permissions = response.data.reduce((acc, code) => {
            acc[code] = {};
            return acc;
          }, {} as any);
          
          this.ngxPermissionsService.loadPermissions(Object.keys(permissions));
        }
      })
    );
  }

  /**
   * Obtener menú del usuario
   */
  listMenu(): Observable<INavData[]> {
    const menuItemsJson = sessionStorage.getItem("menuConfig");
    const updateMenuConfig = sessionStorage.getItem("updateMenuConfig") === "true";

    if (menuItemsJson && !updateMenuConfig) {
      const items: INavData[] = JSON.parse(menuItemsJson);
      return of(this.addAdminMenu(items));
    }

    sessionStorage.setItem("updateMenuConfig", "false");

    // Cargar permisos y menú en paralelo
    return forkJoin({
      permissions: this.menuOptionsService.getUserPermissions(),
      menu: this.menuOptionsService.listTree()
    }).pipe(
      map(({ permissions, menu }) => {
        const items: INavData[] = [];

        // Home siempre presente
        items.push({
          name: this.translate.instant("MENUOPTIONS.HOME"),
          url: "/home",
          iconComponent: { name: "cil-home" },
        });

        if (this.enableTitle) {
          items.push({
            title: true,
            name: this.translate.instant("MENUOPTIONS.OPTIONS"),
          });
        }

        // Cargar permisos en ngx-permissions
        if (permissions.isValid && permissions.data) {
          const permissionsCodes = permissions.data;
          const permissionsObj = permissionsCodes.reduce((acc, code) => {
            acc[code] = {};
            return acc;
          }, {} as any);
          
          this.ngxPermissionsService.loadPermissions(Object.keys(permissionsObj));
        }

        // Construir menú desde el backend
        if (menu.isValid && menu.data) {
          const tree = this.mapMenuOptions(menu.data);
          items.push(...tree);
          sessionStorage.setItem("menuConfig", JSON.stringify(items));
        }

        return this.addAdminMenu(items);
      })
    );
  }

  /**
   * Mapea las opciones de menú a INavData de forma recursiva
   */
  private mapMenuOptions(options: MenuOptionDto[]): INavData[] {
    return options
      .map((o) => {
        const children = o.children && o.children.length > 0 
          ? this.mapMenuOptions(o.children) 
          : undefined;

        return {
          name: o.code
            ? this.translate.instant("MENUOPTIONS." + o.code.toUpperCase().replaceAll("-", "_"))
            : o.name,
          url: o.menuUri,
          iconComponent: o.menuIcon ? { name: o.menuIcon } : undefined,
          children: children,
        } as INavData;
      })
      .sort((a, b) => {
        const sortA = options.find(
          (opt) => opt.code?.toUpperCase().replaceAll("-", "_") === a.name
        )?.sortOrder ?? 0;
        const sortB = options.find(
          (opt) => opt.code?.toUpperCase().replaceAll("-", "_") === b.name
        )?.sortOrder ?? 0;
        return sortA - sortB;
      });
  }

  private addAdminMenu(items: INavData[]): INavData[] {
    if (!environment.frontend.developerMode) return items;

    items.push({
      title: true,
      name: "Admin Menu (Developer)",
    });

    return items.concat(navItems);
  }
}
```

---

## 🚀 Uso en el App Component

```typescript
import { Component, OnInit } from '@angular/core';
import { MenuOptionsNavService } from './services/menu-options-nav.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  
  constructor(
    private menuOptionsNavService: MenuOptionsNavService
  ) {}

  ngOnInit() {
    // Cargar permisos al iniciar la aplicación
    this.menuOptionsNavService.loadUserPermissions().subscribe();
  }
}
```

---

## 🔐 Uso de Permisos en Componentes

### En Templates (HTML)

```html
<!-- Mostrar botón solo si tiene permiso -->
<button *ngxPermissionsOnly="['ventas.create']">
  Crear Venta
</button>

<!-- Mostrar sección solo si tiene alguno de los permisos -->
<div *ngxPermissionsOnly="['ventas.view', 'ventas.list']">
  <h3>Ventas</h3>
</div>

<!-- Ocultar si tiene permiso -->
<div *ngxPermissionsExcept="['ventas.delete']">
  <p>No puedes eliminar ventas</p>
</div>
```

### En Componentes (TypeScript)

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

  constructor(
    private permissionsService: NgxPermissionsService
  ) {}

  ngOnInit() {
    // Verificar permisos
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

### En Guards (Proteger Rutas)

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
  },
  {
    path: 'ventas/editar/:id',
    component: EditarVentaComponent,
    canActivate: [PermissionGuard],
    data: { permission: 'ventas.update' }
  }
];
```

---

## 📝 Ejemplo Completo de Flujo

### 1. Login del Usuario

```typescript
// auth.service.ts
login(email: string, password: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
    tap((response: any) => {
      if (response.isValid && response.data.token) {
        // Guardar token
        localStorage.setItem('token', response.data.token);
        
        // Cargar permisos
        this.menuOptionsNavService.loadUserPermissions().subscribe();
      }
    })
  );
}
```

### 2. Cargar Menú en Layout

```typescript
// default-layout.component.ts
export class DefaultLayoutComponent implements OnInit {
  public navItems: INavData[] = [];

  constructor(
    private menuOptionsNavService: MenuOptionsNavService
  ) {}

  ngOnInit() {
    this.menuOptionsNavService.listMenu().subscribe(
      (items) => {
        this.navItems = items;
      }
    );
  }
}
```

### 3. Usar en Template

```html
<!-- default-layout.component.html -->
<c-sidebar>
  <c-sidebar-nav [navItems]="navItems"></c-sidebar-nav>
</c-sidebar>
```

---

## ⚙️ Configuración Adicional

### Interceptor para Token

```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = localStorage.getItem('token');
    
    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloned);
    }
    
    return next.handle(req);
  }
}
```

**Registrar en app.module.ts:**

```typescript
import { HTTP_INTERCEPTORS } from '@angular/common/http';

providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }
]
```

---

## 🎯 Resumen

Con esta implementación, tu frontend Angular puede:

✅ **Obtener el menú dinámico** basado en permisos del usuario  
✅ **Cargar permisos** en `ngx-permissions` automáticamente  
✅ **Mostrar/ocultar elementos** según permisos  
✅ **Proteger rutas** con guards  
✅ **Verificar permisos** en componentes  
✅ **Estructura jerárquica** con children (menús y submenús)  

El backend ya está **100% listo** para soportar tu frontend Angular con el sistema de permisos granular.
