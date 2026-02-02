# Guía de Migración - Sistema de Menús y Permisos

## 🔄 Cambios en los Modelos

### Modelos Deprecados

Los siguientes modelos se mantienen por compatibilidad pero están marcados como `@deprecated`:

- `GetMenuOptionModel` - Usar `MenuOptionDto` en su lugar
- `CreateMenuOptionModel` - Usar `MenuOptionDto` en su lugar
- `UpdateMenuOptionModel` - Usar `MenuOptionDto` en su lugar
- `ListMenuOptionModel` - Usar `MenuOptionDto` en su lugar
- `SearchMenuOptionModel` - Usar `MenuOptionDto` en su lugar

### Modelo Principal: MenuOptionDto

```typescript
export interface MenuOptionDto {
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

## 📝 Cómo Migrar tu Código

### Antes (Código Antiguo)

```typescript
import { GetMenuOptionModel } from './models/get-menu-option.model';

export class MyComponent {
  menuOptions: GetMenuOptionModel[] = [];
  
  loadMenu() {
    this.menuService.listTree('APP_CODE').subscribe(
      (response) => {
        this.menuOptions = response.data;
      }
    );
  }
}
```

### Después (Código Nuevo)

```typescript
import { MenuOptionDto } from './models/menu-option.dto';
// O mejor aún:
import { MenuOptionDto } from './models';

export class MyComponent {
  menuOptions: MenuOptionDto[] = [];
  
  loadMenu() {
    // Ya no se necesita applicationCode
    this.menuService.listTree().subscribe(
      (response) => {
        this.menuOptions = response.data;
      }
    );
  }
}
```

## 🔧 Cambios en el Servicio

### Antes

```typescript
// Requería applicationCode
this.menuService.listTree('APP_CODE');
this.menuService.list('APP_CODE');
this.menuService.listAll('APP_CODE');
```

### Después

```typescript
// Ya no requiere applicationCode
this.menuService.listTree();
this.menuService.getUserPermissions();
this.menuService.checkPermission('ventas.create');
```

## 🚨 Breaking Changes

### 1. Eliminado parámetro applicationCode

**Antes:**
```typescript
listTree(applicationCode: string): Observable<ResponseDto<MenuOptionDto[]>>
```

**Después:**
```typescript
listTree(): Observable<ResponseDto<MenuOptionDto[]>>
```

### 2. Tipo de ID cambió de string a number

**Antes:**
```typescript
interface GetMenuOptionModel {
  id: string; // ❌
}
```

**Después:**
```typescript
interface MenuOptionDto {
  id: number; // ✅
}
```

### 3. Propiedades nullable

**Antes:**
```typescript
interface MenuOptionDto {
  menuUri: string;
  menuIcon: string;
  actionCode: string;
}
```

**Después:**
```typescript
interface MenuOptionDto {
  menuUri: string | null;
  menuIcon: string | null;
  actionCode: string | null;
}
```

## 📦 Módulo Simplificado

El `MenuOptionsModule` ya no requiere importar servicios externos que no existen:

### Antes

```typescript
@NgModule({
  imports: [
    SharedModule,
    TranslateModule.forChild(),
  ],
  providers: [
    ModulesService,
    ActionsService,
    ApplicationsService,
    MenuOptionsService,
    MenuOptionsNavService,
  ]
})
export class MenuOptionsModule {}
```

### Después

```typescript
@NgModule({
  imports: [
    CommonModule,
    MenuOptionsRoutingModule,
  ],
  providers: [
    // Los servicios están provistos en 'root'
  ]
})
export class MenuOptionsModule {}
```

## ✅ Checklist de Migración

- [ ] Reemplazar `GetMenuOptionModel` por `MenuOptionDto`
- [ ] Eliminar parámetro `applicationCode` de llamadas al servicio
- [ ] Actualizar tipos de `id` de `string` a `number`
- [ ] Manejar propiedades nullable (`menuUri`, `menuIcon`, `actionCode`)
- [ ] Actualizar imports a usar `from './models'` en lugar de rutas específicas
- [ ] Verificar que no se usen servicios deprecados (`ModulesService`, `ActionsService`, etc.)
- [ ] Probar que el menú se renderice correctamente
- [ ] Verificar que los permisos funcionen

## 🎯 Ejemplo Completo de Migración

### Componente Antiguo

```typescript
import { Component, OnInit } from '@angular/core';
import { MenuOptionsService } from './services/menu-options.service';
import { GetMenuOptionModel } from './models/get-menu-option.model';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-menu',
  template: `
    <ul>
      <li *ngFor="let item of menuItems">
        {{ item.name }}
      </li>
    </ul>
  `
})
export class MenuComponent implements OnInit {
  menuItems: GetMenuOptionModel[] = [];

  constructor(private menuService: MenuOptionsService) {}

  ngOnInit() {
    this.loadMenu();
  }

  loadMenu() {
    this.menuService.listTree(environment.application.code).subscribe(
      (response) => {
        if (response.isValid) {
          this.menuItems = response.data;
        }
      }
    );
  }
}
```

### Componente Nuevo

```typescript
import { Component, OnInit, signal } from '@angular/core';
import { MenuOptionsService } from './services/menu-options.service';
import { MenuOptionDto } from './models';

@Component({
  selector: 'app-menu',
  template: `
    <ul>
      @for (item of menuItems(); track item.id) {
        <li>{{ item.name }}</li>
      }
    </ul>
  `
})
export class MenuComponent implements OnInit {
  menuItems = signal<MenuOptionDto[]>([]);

  constructor(private menuService: MenuOptionsService) {}

  ngOnInit() {
    this.loadMenu();
  }

  loadMenu() {
    this.menuService.listTree().subscribe({
      next: (response) => {
        if (response.isValid) {
          this.menuItems.set(response.data);
        }
      },
      error: (err) => {
        console.error('Error loading menu:', err);
        this.menuItems.set([]);
      }
    });
  }
}
```

## 🔍 Verificación

Después de migrar, verifica:

1. **Compilación**: `npm run build` debe completarse sin errores
2. **Tipos**: No debe haber errores de TypeScript
3. **Runtime**: El menú debe renderizarse correctamente
4. **Permisos**: Los permisos deben funcionar según el rol del usuario
5. **Navegación**: Las rutas deben estar protegidas correctamente

## 📞 Soporte

Si encuentras problemas durante la migración:

1. Revisa la documentación en `README.md`
2. Consulta los ejemplos en `EJEMPLOS_USO.md`
3. Verifica los cambios en `CAMBIOS_MENU_PERMISOS.md`
4. Revisa la integración con el backend en `INTEGRACION_ANGULAR.md`
