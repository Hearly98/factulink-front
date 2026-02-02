# Resumen de Cambios - Sistema de Menús y Permisos

## 📝 Cambios Realizados

### 1. Actualización del Modelo MenuOptionDto

**Archivo:** `src/app/menu-options/models/menu-option.dto.ts`

**Cambios:**
- ✅ Eliminado `applicationId` (ya no se usa `applicationCode`)
- ✅ Eliminado `actionId` y `parentMenuOptionId` (manejados por el backend)
- ✅ Agregado `id: number` para identificación
- ✅ Cambiado tipos a nullable donde corresponde (`menuUri`, `menuIcon`, `actionCode`)
- ✅ Agregado `description` como opcional

**Antes:**
```typescript
export class MenuOptionDto {
  applicationId: string;
  actionId: string;
  parentMenuOptionId: string;
  code: string;
  name: string;
  description: string;
  menuUri: string;
  menuIcon: string;
  sortOrder: number;
  actionCode: string;
  children: MenuOptionDto[];
}
```

**Después:**
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

---

### 2. Refactorización del MenuOptionsService

**Archivo:** `src/app/menu-options/services/menu-options.service.ts`

**Cambios:**
- ✅ Eliminada herencia de `BaseService`
- ✅ Cambiado endpoint a `/api/permissions`
- ✅ Eliminado parámetro `applicationCode` de todos los métodos
- ✅ Simplificado a 3 métodos principales:
  - `listTree()` - Obtiene menú jerárquico
  - `getUserPermissions()` - Obtiene permisos del usuario
  - `checkPermission(actionCode)` - Verifica permiso específico
- ✅ Agregado `providedIn: 'root'` para inyección global

**Antes:**
```typescript
@Injectable()
export class MenuOptionsService extends BaseService {
  constructor(http: HttpClient) {
    super(http, `${environment.backend.baseApiSecutityUrl}/menu-option`);
  }

  listTree(applicationCode: string): Observable<ResponseDto<GetMenuOptionModel[]>> {
    return this.getRequest<ResponseDto<GetMenuOptionModel[]>>(`/${applicationCode}/tree`);
  }
  // ... más métodos
}
```

**Después:**
```typescript
@Injectable({
  providedIn: 'root'
})
export class MenuOptionsService {
  private apiUrl = `${environment.apiUrl}/permissions`;

  constructor(private http: HttpClient) {}

  listTree(): Observable<ResponseDto<MenuOptionDto[]>> {
    return this.http.get<ResponseDto<MenuOptionDto[]>>(`${this.apiUrl}/menu`);
  }

  getUserPermissions(): Observable<ResponseDto<string[]>> {
    return this.http.get<ResponseDto<string[]>>(`${this.apiUrl}/user-permissions`);
  }

  checkPermission(actionCode: string): Observable<ResponseDto<any>> {
    return this.http.post<ResponseDto<any>>(`${this.apiUrl}/check`, { action_code: actionCode });
  }
}
```

---

### 3. Mejora del MenuOptionsNavService

**Archivo:** `src/app/menu-options/services/menu-options-nav.service.ts`

**Cambios:**
- ✅ Agregado método `loadUserPermissions()` para cargar permisos en `ngx-permissions`
- ✅ Eliminada dependencia de `TranslateService` (simplificado)
- ✅ Eliminada dependencia de `environment.application.code`
- ✅ Uso de `forkJoin` para cargar permisos y menú en paralelo
- ✅ Eliminado filtrado manual de permisos (el backend ya lo hace)
- ✅ Simplificado mapeo de menú (usa `name` directamente)
- ✅ Agregado `providedIn: 'root'`

**Características:**
- Carga permisos y menú en paralelo para mejor rendimiento
- Cachea el menú en `sessionStorage`
- Integración automática con `ngx-permissions`

---

### 4. Actualización del DefaultLayoutComponent

**Archivo:** `src/app/layout/default-layout/default-layout.component.ts`

**Cambios:**
- ✅ Implementado `OnInit` para cargar menú dinámicamente
- ✅ Cambiado `navItems` a `signal<INavData[]>` para reactividad
- ✅ Agregado método `loadMenu()` que obtiene el menú del backend
- ✅ Manejo de errores con fallback a menú vacío
- ✅ Uso de `inject()` en lugar de constructor injection

**Antes:**
```typescript
export class DefaultLayoutComponent {
  public navItems = [...navItems];
}
```

**Después:**
```typescript
export class DefaultLayoutComponent implements OnInit {
  public navItems = signal<INavData[]>([]);
  private menuOptionsNavService = inject(MenuOptionsNavService);

  ngOnInit() {
    this.loadMenu();
  }

  private loadMenu() {
    this.menuOptionsNavService.listMenu().subscribe({
      next: (items: INavData[]) => {
        this.navItems.set(items);
      },
      error: (err: Error) => {
        console.error('Error loading menu:', err);
        this.navItems.set([]);
      }
    });
  }
}
```

**Template:**
```html
<c-sidebar-nav [navItems]="navItems()" dropdownMode="close" compact />
```

---

### 5. Integración con AuthService

**Archivo:** `src/app/core/auth/services/auth.service.ts`

**Cambios:**
- ✅ Agregada carga automática de permisos después del login
- ✅ Agregada carga automática de permisos después del registro
- ✅ Agregada carga de permisos al inicializar si hay token válido
- ✅ Limpieza de caché de menú al hacer logout

**Flujo:**
1. Usuario hace login
2. Se guarda el token
3. Se cargan los permisos automáticamente
4. El menú se renderiza según los permisos

---

### 6. Nuevos Archivos Creados

#### Guard de Permisos
**Archivo:** `src/app/core/guards/permission.guard.ts`

Guard para proteger rutas basado en permisos del usuario.

**Uso:**
```typescript
{
  path: 'ventas/crear',
  component: CrearVentaComponent,
  canActivate: [PermissionGuard],
  data: { permission: 'ventas.create' }
}
```

#### Documentación
- ✅ `src/app/menu-options/README.md` - Documentación completa del módulo
- ✅ `src/app/menu-options/EJEMPLOS_USO.md` - Ejemplos prácticos de uso
- ✅ `CAMBIOS_MENU_PERMISOS.md` - Este archivo

---

## 🔄 Flujo Completo del Sistema

```
1. Usuario hace LOGIN
   ↓
2. AuthService guarda token y usuario
   ↓
3. AuthService carga permisos (getUserPermissions)
   ↓
4. Permisos se cargan en ngx-permissions
   ↓
5. DefaultLayoutComponent carga menú (listTree)
   ↓
6. Backend filtra menú según permisos del usuario
   ↓
7. Menú se renderiza en el sidebar
   ↓
8. Usuario navega por la aplicación
   ↓
9. Guards protegen rutas según permisos
   ↓
10. Directivas muestran/ocultan elementos según permisos
```

---

## 🎯 Endpoints del Backend

### GET /api/permissions/menu
Obtiene el menú jerárquico del usuario autenticado.

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
    }
  ],
  "isValid": true,
  "messages": [],
  "errors": []
}
```

### GET /api/permissions/user-permissions
Obtiene los códigos de permisos del usuario.

**Respuesta:**
```json
{
  "data": [
    "ventas.list",
    "ventas.create",
    "ventas.view",
    "productos.list"
  ],
  "isValid": true,
  "messages": [],
  "errors": []
}
```

### POST /api/permissions/check
Verifica si el usuario tiene un permiso específico.

**Request:**
```json
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
  "messages": [],
  "errors": []
}
```

---

## ✅ Ventajas de la Nueva Implementación

1. **Sin dependencia de applicationCode**: Simplifica la configuración
2. **Carga automática de permisos**: No requiere configuración manual
3. **Menú dinámico**: Se actualiza según los permisos del usuario
4. **Mejor rendimiento**: Carga paralela de permisos y menú
5. **Caché inteligente**: Reduce llamadas al backend
6. **Type-safe**: Uso de TypeScript para evitar errores
7. **Reactivo**: Uso de signals para mejor rendimiento
8. **Fácil de usar**: Directivas simples para mostrar/ocultar elementos
9. **Protección de rutas**: Guards automáticos basados en permisos
10. **Documentación completa**: Ejemplos y guías de uso

---

## 🚀 Próximos Pasos

1. **Probar el sistema**: Verificar que el menú se renderice correctamente
2. **Agregar permisos a rutas**: Proteger rutas con `PermissionGuard`
3. **Usar directivas**: Agregar `*ngxPermissionsOnly` en templates
4. **Crear constantes**: Definir códigos de permisos en constantes
5. **Agregar tests**: Crear tests unitarios para los servicios

---

## 📚 Recursos

- [Documentación ngx-permissions](https://github.com/AlexKhymenko/ngx-permissions)
- [CoreUI Angular](https://coreui.io/angular/)
- [Angular Signals](https://angular.dev/guide/signals)
- [RxJS forkJoin](https://rxjs.dev/api/index/function/forkJoin)

---

## 🐛 Troubleshooting

### El menú no se muestra
1. Verificar que el usuario tenga permisos en el backend
2. Revisar la consola del navegador
3. Verificar que el token sea válido
4. Limpiar `sessionStorage`

### Los permisos no funcionan
1. Verificar que `loadUserPermissions()` se haya ejecutado
2. Revisar que los códigos de permisos coincidan
3. Verificar que `ngx-permissions` esté configurado

### Error de compilación
1. Ejecutar `npm install`
2. Verificar que todas las dependencias estén instaladas
3. Limpiar caché: `npm run clean` (si existe)

---

## 📞 Contacto

Para dudas o problemas, consultar:
- `src/app/menu-options/README.md`
- `src/app/menu-options/EJEMPLOS_USO.md`
- Documentación del backend en `INTEGRACION_ANGULAR.md`
