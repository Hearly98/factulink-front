# Instalación Rápida - Sistema de Permisos

## 🚀 Pasos de Instalación

### 1. Ejecutar Migraciones

```bash
php artisan migrate
```

Esto creará las siguientes tablas:
- `modules` - Módulos del sistema
- `actions` - Acciones/permisos disponibles
- `permissions` - Relación entre roles y acciones
- `menu_options` - Opciones de menú

### 2. Ejecutar Seeder

```bash
php artisan db:seed --class=SecuritySeeder
```

Esto creará:
- ✅ 6 módulos (Ventas, Compras, Inventario, Clientes, Reportes, Configuración)
- ✅ 30+ acciones
- ✅ 3 roles con permisos:
  - **Administrador**: Acceso total
  - **Vendedor**: Ventas, clientes, productos (solo lectura)
  - **Almacenero**: Inventario, compras, stock

### 3. Registrar Rutas

En `routes/api.php`, agregar al final:

```php
// Rutas de permisos
require __DIR__.'/permissions.php';
```

### 4. Registrar Middleware (Opcional)

En `bootstrap/app.php`:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'permission' => \App\Http\Middleware\CheckPermission::class,
    ]);
})
```

### 5. Registrar Helper (Opcional)

En `composer.json`, agregar en la sección `autoload`:

```json
"files": [
    "app/Helpers/PermissionHelper.php"
]
```

Luego ejecutar:

```bash
composer dump-autoload
```

---

## 🧪 Probar el Sistema

### Verificar que las tablas se crearon

```bash
php artisan tinker
```

```php
// Ver módulos
App\Models\Module::count();

// Ver acciones
App\Models\Action::count();

// Ver roles
App\Models\Rol::with('permissions')->get();
```

### Asignar un rol a un usuario existente

```php
$usuario = App\Models\Usuario::first();
$rolAdmin = App\Models\Rol::where('rol_nom', 'Administrador')->first();

$usuario->rol_id = $rolAdmin->rol_id;
$usuario->save();

// Verificar permisos
$usuario->hasPermission('ventas.create'); // true
```

### Obtener menú del usuario

```php
$usuario = App\Models\Usuario::first();
$menu = $usuario->menu();
```

---

## 📝 Uso Básico

### En Controladores

```php
public function store(Request $request)
{
    $usuario = $request->user();
    
    if (!$usuario->hasPermission('ventas.create')) {
        return response()->json(['message' => 'Sin permisos'], 403);
    }
    
    // Tu lógica aquí
}
```

### Con Middleware

```php
Route::middleware(['auth:sanctum', 'permission:ventas.create'])
    ->post('/ventas', [VentaController::class, 'store']);
```

### En Blade (si usas)

```php
@if(auth()->user()->hasPermission('ventas.create'))
    <button>Crear Venta</button>
@endif
```

---

## 📚 Documentación Completa

Ver `SISTEMA_PERMISOS_GUIA.md` para:
- Ejemplos detallados
- API Endpoints
- Mejores prácticas
- Consultas SQL útiles

---

## 🔧 Personalización

### Agregar un nuevo módulo

```php
use App\Models\Module;

Module::create([
    'mod_code' => 'mi_modulo',
    'mod_nom' => 'Mi Módulo',
    'mod_desc' => 'Descripción',
    'mod_icon' => 'icon-name',
    'mod_order' => 10,
]);
```

### Agregar acciones al módulo

```php
use App\Models\Action;

Action::create([
    'mod_id' => $module->mod_id,
    'act_code' => 'mi_modulo.crear',
    'act_nom' => 'Crear en Mi Módulo',
]);
```

### Asignar permisos a un rol

```php
use App\Models\Permission;

Permission::create([
    'rol_id' => $rol->rol_id,
    'act_id' => $action->act_id,
    'est' => true,
]);
```

---

## ⚠️ Notas Importantes

1. **Compatibilidad**: Funciona con MySQL y SQLite
2. **Auditoría**: Todas las tablas tienen campos `created_by` y `updated_by` (puedes implementar esto con observers)
3. **Soft Delete**: Usa el campo `est` (estado) en lugar de eliminar registros
4. **Performance**: Considera agregar caché para verificación de permisos en producción

---

## 🐛 Troubleshooting

### Error: "Table doesn't exist"
```bash
php artisan migrate:fresh
php artisan db:seed --class=SecuritySeeder
```

### Error: "Class not found"
```bash
composer dump-autoload
```

### Los permisos no funcionan
Verificar que:
1. El usuario tenga un `rol_id` asignado
2. El rol tenga permisos en la tabla `permissions`
3. Los campos `est` estén en `true`

---

## 📞 Soporte

Para más información, consulta:
- `SISTEMA_PERMISOS_GUIA.md` - Guía completa
- `Seguridad_DB_Documentation.md` - Documentación del sistema original
