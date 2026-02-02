# Ejemplos de Uso - Sistema de Permisos

## 🎯 Casos de Uso Comunes

### 1. Mostrar/Ocultar Botones según Permisos

```html
<!-- ventas-list.component.html -->
<div class="d-flex justify-content-between mb-3">
  <h2>Lista de Ventas</h2>
  
  <!-- Botón solo visible si tiene permiso para crear -->
  <button 
    *ngxPermissionsOnly="['ventas.create']"
    class="btn btn-primary"
    (click)="crearVenta()">
    <i class="cil-plus"></i> Nueva Venta
  </button>
</div>

<table class="table">
  <thead>
    <tr>
      <th>ID</th>
      <th>Cliente</th>
      <th>Total</th>
      <th>Fecha</th>
      <th *ngxPermissionsOnly="['ventas.update', 'ventas.delete']">Acciones</th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let venta of ventas">
      <td>{{ venta.id }}</td>
      <td>{{ venta.cliente }}</td>
      <td>{{ venta.total | currency }}</td>
      <td>{{ venta.fecha | date }}</td>
      <td *ngxPermissionsOnly="['ventas.update', 'ventas.delete']">
        <!-- Botón editar solo si tiene permiso -->
        <button 
          *ngxPermissionsOnly="['ventas.update']"
          class="btn btn-sm btn-warning"
          (click)="editar(venta.id)">
          <i class="cil-pencil"></i>
        </button>
        
        <!-- Botón eliminar solo si tiene permiso -->
        <button 
          *ngxPermissionsOnly="['ventas.delete']"
          class="btn btn-sm btn-danger"
          (click)="eliminar(venta.id)">
          <i class="cil-trash"></i>
        </button>
      </td>
    </tr>
  </tbody>
</table>
```

### 2. Verificar Permisos en el Componente

```typescript
// ventas-list.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ventas-list',
  templateUrl: './ventas-list.component.html'
})
export class VentasListComponent implements OnInit {
  private permissionsService = inject(NgxPermissionsService);
  private router = inject(Router);
  
  ventas: any[] = [];
  canCreate = false;
  canUpdate = false;
  canDelete = false;
  canExport = false;

  ngOnInit() {
    this.checkPermissions();
    this.loadVentas();
  }

  private checkPermissions() {
    this.canCreate = this.hasPermission('ventas.create');
    this.canUpdate = this.hasPermission('ventas.update');
    this.canDelete = this.hasPermission('ventas.delete');
    this.canExport = this.hasPermission('ventas.pdf');
  }

  private hasPermission(permission: string): boolean {
    return this.permissionsService.getPermission(permission) !== undefined;
  }

  crearVenta() {
    if (!this.canCreate) {
      alert('No tienes permiso para crear ventas');
      return;
    }
    this.router.navigate(['/ventas/crear']);
  }

  editar(id: number) {
    if (!this.canUpdate) {
      alert('No tienes permiso para editar ventas');
      return;
    }
    this.router.navigate(['/ventas/editar', id]);
  }

  eliminar(id: number) {
    if (!this.canDelete) {
      alert('No tienes permiso para eliminar ventas');
      return;
    }
    
    if (confirm('¿Estás seguro de eliminar esta venta?')) {
      // Lógica para eliminar
    }
  }

  exportarPDF(id: number) {
    if (!this.canExport) {
      alert('No tienes permiso para exportar ventas');
      return;
    }
    // Lógica para exportar
  }

  private loadVentas() {
    // Lógica para cargar ventas
  }
}
```

### 3. Proteger Rutas con Guard

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { PermissionGuard } from './core/guards/permission.guard';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'ventas',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: VentasListComponent,
        canActivate: [PermissionGuard],
        data: { permission: 'ventas.list' }
      },
      {
        path: 'crear',
        component: CrearVentaComponent,
        canActivate: [PermissionGuard],
        data: { permission: 'ventas.create' }
      },
      {
        path: 'editar/:id',
        component: EditarVentaComponent,
        canActivate: [PermissionGuard],
        data: { permission: 'ventas.update' }
      },
      {
        path: 'ver/:id',
        component: VerVentaComponent,
        canActivate: [PermissionGuard],
        data: { permission: 'ventas.view' }
      }
    ]
  },
  {
    path: 'configuracion',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'usuarios',
        component: UsuariosComponent,
        canActivate: [PermissionGuard],
        data: { permission: 'usuarios.list' }
      },
      {
        path: 'roles',
        component: RolesComponent,
        canActivate: [PermissionGuard],
        data: { permission: 'roles.manage' }
      }
    ]
  }
];
```

### 4. Mostrar Contenido Condicional

```html
<!-- dashboard.component.html -->
<div class="row">
  <!-- Card de Ventas - solo si tiene permiso -->
  <div class="col-md-4" *ngxPermissionsOnly="['ventas.list']">
    <div class="card">
      <div class="card-body">
        <h5>Ventas del Mes</h5>
        <p class="display-4">{{ ventasMes | currency }}</p>
        <a routerLink="/ventas" class="btn btn-primary">Ver Ventas</a>
      </div>
    </div>
  </div>

  <!-- Card de Compras - solo si tiene permiso -->
  <div class="col-md-4" *ngxPermissionsOnly="['compras.list']">
    <div class="card">
      <div class="card-body">
        <h5>Compras del Mes</h5>
        <p class="display-4">{{ comprasMes | currency }}</p>
        <a routerLink="/compras" class="btn btn-primary">Ver Compras</a>
      </div>
    </div>
  </div>

  <!-- Card de Reportes - solo si tiene alguno de estos permisos -->
  <div class="col-md-4" *ngxPermissionsOnly="['reportes.ventas', 'reportes.compras', 'reportes.inventario']">
    <div class="card">
      <div class="card-body">
        <h5>Reportes</h5>
        <div class="list-group">
          <a 
            *ngxPermissionsOnly="['reportes.ventas']"
            routerLink="/reportes/ventas" 
            class="list-group-item list-group-item-action">
            Reporte de Ventas
          </a>
          <a 
            *ngxPermissionsOnly="['reportes.compras']"
            routerLink="/reportes/compras" 
            class="list-group-item list-group-item-action">
            Reporte de Compras
          </a>
          <a 
            *ngxPermissionsOnly="['reportes.inventario']"
            routerLink="/reportes/inventario" 
            class="list-group-item list-group-item-action">
            Reporte de Inventario
          </a>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Sección de Administración - solo para administradores -->
<div class="row mt-4" *ngxPermissionsOnly="['usuarios.list', 'roles.manage']">
  <div class="col-12">
    <h3>Administración</h3>
    <div class="btn-group">
      <button 
        *ngxPermissionsOnly="['usuarios.list']"
        routerLink="/configuracion/usuarios"
        class="btn btn-secondary">
        Gestionar Usuarios
      </button>
      <button 
        *ngxPermissionsOnly="['roles.manage']"
        routerLink="/configuracion/roles"
        class="btn btn-secondary">
        Gestionar Roles
      </button>
    </div>
  </div>
</div>
```

### 5. Deshabilitar Campos según Permisos

```html
<!-- venta-form.component.html -->
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <div class="mb-3">
    <label>Cliente</label>
    <select 
      formControlName="cliente_id" 
      class="form-control"
      [disabled]="!canEdit">
      <option *ngFor="let cliente of clientes" [value]="cliente.id">
        {{ cliente.nombre }}
      </option>
    </select>
  </div>

  <div class="mb-3">
    <label>Total</label>
    <input 
      type="number" 
      formControlName="total" 
      class="form-control"
      [readonly]="!canEditTotal">
  </div>

  <div class="mb-3">
    <label>Descuento</label>
    <input 
      type="number" 
      formControlName="descuento" 
      class="form-control"
      [readonly]="!hasPermission('ventas.apply_discount')">
  </div>

  <div class="d-flex gap-2">
    <button 
      type="submit" 
      class="btn btn-primary"
      [disabled]="!canSave">
      Guardar
    </button>
    
    <button 
      *ngxPermissionsOnly="['ventas.delete']"
      type="button" 
      class="btn btn-danger"
      (click)="eliminar()">
      Eliminar
    </button>
    
    <button 
      *ngxPermissionsOnly="['ventas.pdf']"
      type="button" 
      class="btn btn-secondary"
      (click)="generarPDF()">
      Generar PDF
    </button>
  </div>
</form>
```

```typescript
// venta-form.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-venta-form',
  templateUrl: './venta-form.component.html'
})
export class VentaFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private permissionsService = inject(NgxPermissionsService);
  
  form!: FormGroup;
  canEdit = false;
  canEditTotal = false;
  canSave = false;

  ngOnInit() {
    this.checkPermissions();
    this.createForm();
  }

  private checkPermissions() {
    this.canEdit = this.hasPermission('ventas.update');
    this.canEditTotal = this.hasPermission('ventas.edit_total');
    this.canSave = this.hasPermission('ventas.create') || this.hasPermission('ventas.update');
  }

  hasPermission(permission: string): boolean {
    return this.permissionsService.getPermission(permission) !== undefined;
  }

  private createForm() {
    this.form = this.fb.group({
      cliente_id: [{ value: null, disabled: !this.canEdit }],
      total: [{ value: 0, disabled: !this.canEditTotal }],
      descuento: [{ value: 0, disabled: !this.hasPermission('ventas.apply_discount') }]
    });
  }

  onSubmit() {
    if (!this.canSave) {
      alert('No tienes permiso para guardar');
      return;
    }
    // Lógica para guardar
  }

  eliminar() {
    if (!this.hasPermission('ventas.delete')) {
      alert('No tienes permiso para eliminar');
      return;
    }
    // Lógica para eliminar
  }

  generarPDF() {
    if (!this.hasPermission('ventas.pdf')) {
      alert('No tienes permiso para generar PDF');
      return;
    }
    // Lógica para generar PDF
  }
}
```

### 6. Verificar Múltiples Permisos

```typescript
// utils/permission.utils.ts
import { NgxPermissionsService } from 'ngx-permissions';

export class PermissionUtils {
  /**
   * Verifica si el usuario tiene TODOS los permisos especificados
   */
  static hasAllPermissions(
    permissionsService: NgxPermissionsService,
    permissions: string[]
  ): boolean {
    return permissions.every(
      permission => permissionsService.getPermission(permission) !== undefined
    );
  }

  /**
   * Verifica si el usuario tiene AL MENOS UNO de los permisos especificados
   */
  static hasAnyPermission(
    permissionsService: NgxPermissionsService,
    permissions: string[]
  ): boolean {
    return permissions.some(
      permission => permissionsService.getPermission(permission) !== undefined
    );
  }
}
```

```typescript
// Uso en componente
import { Component, OnInit, inject } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { PermissionUtils } from './utils/permission.utils';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html'
})
export class ReportesComponent implements OnInit {
  private permissionsService = inject(NgxPermissionsService);
  
  canAccessReports = false;
  canExportAll = false;

  ngOnInit() {
    // Verificar si tiene al menos un permiso de reportes
    this.canAccessReports = PermissionUtils.hasAnyPermission(
      this.permissionsService,
      ['reportes.ventas', 'reportes.compras', 'reportes.inventario']
    );

    // Verificar si tiene todos los permisos de exportación
    this.canExportAll = PermissionUtils.hasAllPermissions(
      this.permissionsService,
      ['reportes.export', 'reportes.pdf', 'reportes.excel']
    );
  }
}
```

## 🎨 Mejores Prácticas

1. **Siempre verificar permisos en el backend**: El frontend es solo para UX, la seguridad real está en el backend
2. **Usar guards para rutas**: Protege las rutas antes de que el usuario acceda
3. **Mostrar mensajes claros**: Informa al usuario por qué no puede realizar una acción
4. **Cachear verificaciones**: Evita verificar el mismo permiso múltiples veces
5. **Usar constantes**: Define los códigos de permisos en constantes para evitar errores de tipeo

```typescript
// constants/permissions.constants.ts
export const PERMISSIONS = {
  VENTAS: {
    LIST: 'ventas.list',
    CREATE: 'ventas.create',
    UPDATE: 'ventas.update',
    DELETE: 'ventas.delete',
    VIEW: 'ventas.view',
    PDF: 'ventas.pdf'
  },
  COMPRAS: {
    LIST: 'compras.list',
    CREATE: 'compras.create',
    UPDATE: 'compras.update',
    DELETE: 'compras.delete'
  },
  USUARIOS: {
    LIST: 'usuarios.list',
    CREATE: 'usuarios.create',
    UPDATE: 'usuarios.update',
    DELETE: 'usuarios.delete'
  }
} as const;
```

```typescript
// Uso
import { PERMISSIONS } from './constants/permissions.constants';

// En lugar de:
this.canCreate = this.hasPermission('ventas.create');

// Usar:
this.canCreate = this.hasPermission(PERMISSIONS.VENTAS.CREATE);
```
