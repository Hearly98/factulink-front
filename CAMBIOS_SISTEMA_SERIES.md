# 🔄 Cambios Implementados - Sistema de Series

## 📋 Resumen

Se ha actualizado el sistema de ventas para utilizar la tabla `series` existente, permitiendo generar correlativos automáticos independientes por tipo de documento (Factura, Boleta, etc.).

---

## 🗄️ Cambios en Base de Datos

### Migración Ejecutada: `2025_12_07_214158_update_ventas_table_add_serie_id.php`

**Cambios en tabla `ventas`:**

#### ❌ Eliminado:
- `correlativo` (string, unique) - Campo manual de correlativo

#### ✅ Agregado:
- `serie_id` (foreign key) - Referencia a la tabla `series`
- `numero_completo` (string) - Número completo generado automáticamente (ej: "F001-00000001")

**SQL equivalente:**
```sql
ALTER TABLE ventas 
  DROP COLUMN correlativo,
  ADD COLUMN serie_id BIGINT UNSIGNED AFTER venta_id,
  ADD COLUMN numero_completo VARCHAR(50) AFTER serie_id,
  ADD FOREIGN KEY (serie_id) REFERENCES series(ser_id) ON DELETE SET NULL;
```

---

## 📦 Cambios en Modelos

### Modelo `Venta` (`app/Models/Venta.php`)

#### Campos Actualizados:
```php
protected $fillable = [
    'serie_id',           // ✅ NUEVO
    'numero_completo',    // ✅ NUEVO
    // 'correlativo',     // ❌ ELIMINADO
    'fechaEmision',
    // ... resto de campos
];
```

#### Relación Agregada:
```php
public function serie()
{
    return $this->belongsTo(Serie::class, 'serie_id');
}
```

#### Documentación Swagger Actualizada:
```php
/**
 * @OA\Property(property="serie_id", type="integer", example=1)
 * @OA\Property(property="numero_completo", type="string", example="F001-00000001")
 */
```

---

## 🎮 Cambios en Controladores

### `VentaController` (`app/Http/Controllers/VentaController.php`)

#### 1. Import Agregado:
```php
use App\Models\Serie;
```

#### 2. Método `store()` - Generación Automática de Correlativo

**Antes:**
```php
$venta = Venta::create([
    'correlativo' => $data['correlativo'] ?? null,
    // ...
]);
```

**Ahora:**
```php
// Obtener serie con lock para evitar concurrencia
$serie = Serie::where('ser_id', $data['serie_id'])
    ->where('est', true)
    ->lockForUpdate()
    ->first();

// Validar que la serie corresponda al tipo de documento
if ($serie->doc_cod !== $documento->doc_cod) {
    throw new \Exception('La serie no corresponde al tipo de documento');
}

// Generar número completo
$numeroCompleto = $serie->ser_num . '-' . str_pad($serie->ser_corr, 8, '0', STR_PAD_LEFT);

// Incrementar correlativo
$serie->increment('ser_corr');

// Crear venta
$venta = Venta::create([
    'serie_id' => $data['serie_id'],
    'numero_completo' => $numeroCompleto,
    // ...
]);
```

#### 3. Validaciones Actualizadas:
```php
$data = $request->validate([
    'serie_id' => 'required|exists:series,ser_id',  // ✅ NUEVO (requerido)
    // 'correlativo' => 'nullable|string|...',      // ❌ ELIMINADO
    // ... resto de validaciones
]);
```

#### 4. Método `search()` - DTO Actualizado:
```php
$dto = $items->map(function ($venta) {
    return [
        'venta_id' => $venta->venta_id,
        'numero_completo' => $venta->numero_completo,  // ✅ NUEVO
        'serie' => $venta->serie,                      // ✅ NUEVO
        // 'correlativo' => $venta->correlativo,       // ❌ ELIMINADO
        // ... resto de campos
    ];
});
```

#### 5. Eager Loading Actualizado:
```php
$query = $this->model()
    ->with(['empresa', 'sucursal', 'cliente', 'vendedor', 'documento', 'moneda', 'serie']); // ✅ 'serie' agregado
```

#### 6. Nuevo Método: `seriesPorDocumento()`
```php
/**
 * @OA\Get(
 *     path="/api/ventas/series/{doc_id}",
 *     tags={"Ventas"},
 *     summary="Obtener series disponibles por tipo de documento"
 * )
 */
public function seriesPorDocumento($doc_id)
{
    $documento = \App\Models\Documento::find($doc_id);
    
    if (!$documento) {
        return ResponseHelper::error(['Documento no encontrado'], 404);
    }
    
    $series = Serie::where('doc_cod', $documento->doc_cod)
        ->where('est', true)
        ->get();
    
    return ResponseHelper::success($series);
}
```

---

## 🛣️ Cambios en Rutas

### `routes/v1/ventas.php`

#### Ruta Agregada:
```php
Route::get('series/{doc_id}', [VentaController::class, 'seriesPorDocumento']);
```

#### Rutas Completas:
```php
Route::prefix('ventas')->group(function () {
    Route::post('search', [VentaController::class, 'search']);
    Route::get('series/{doc_id}', [VentaController::class, 'seriesPorDocumento']); // ✅ NUEVO
    Route::get('', [VentaController::class, 'index']);
    Route::post('', [VentaController::class, 'store']);
    Route::get('{venta_id}', [VentaController::class, 'show']);
    Route::delete('{venta_id}', [VentaController::class, 'destroy']);
});
```

**Total de endpoints:** 6 (antes: 5)

---

## 📚 Documentación Swagger

### Cambios en Documentación:

#### 1. Schema `Venta` Actualizado:
```php
@OA\Property(property="serie_id", type="integer", example=1)
@OA\Property(property="numero_completo", type="string", example="F001-00000001")
// @OA\Property(property="correlativo", ...) // ❌ ELIMINADO
```

#### 2. Endpoint `POST /api/ventas` Actualizado:
```php
@OA\Property(property="serie_id", type="integer", example=1, description="ID de la serie para generar correlativo")
// @OA\Property(property="correlativo", ...) // ❌ ELIMINADO
```

#### 3. Nuevo Endpoint Documentado:
```php
/**
 * @OA\Get(
 *     path="/api/ventas/series/{doc_id}",
 *     tags={"Ventas"},
 *     summary="Obtener series disponibles por tipo de documento",
 *     ...
 * )
 */
```

---

## 🔄 Flujo de Trabajo Actualizado

### Antes:
```
1. Usuario ingresa correlativo manualmente
2. Sistema valida que sea único
3. Se crea la venta con el correlativo ingresado
```

### Ahora:
```
1. Usuario selecciona tipo de documento (Factura/Boleta)
2. Sistema obtiene series disponibles: GET /api/ventas/series/{doc_id}
3. Usuario selecciona una serie
4. Sistema genera correlativo automáticamente
5. Se crea la venta con numero_completo generado
```

---

## ✅ Ventajas del Nuevo Sistema

### 1. ✅ Correlativos Automáticos
No es necesario ingresar el correlativo manualmente. El sistema lo genera automáticamente.

### 2. ✅ Independencia por Tipo de Documento
Cada tipo de documento tiene su propia numeración:
- Facturas: F001-00000001, F001-00000002, ...
- Boletas: B001-00000001, B001-00000002, ...

### 3. ✅ Múltiples Series
Puedes tener varias series para el mismo tipo de documento (útil para múltiples sucursales).

### 4. ✅ Control de Concurrencia
El uso de `lockForUpdate()` evita que se generen números duplicados en transacciones simultáneas.

### 5. ✅ Cumplimiento SUNAT
El formato `SERIE-CORRELATIVO` cumple con los estándares de SUNAT.

### 6. ✅ Trazabilidad
Cada venta queda vinculada a su serie, permitiendo auditorías y reportes.

---

## 🔧 Endpoints Actualizados

### 1. ✅ NUEVO: Obtener Series por Documento
```http
GET /api/v1/ventas/series/{doc_id}
```

**Response:**
```json
{
  "data": [
    {
      "ser_id": 1,
      "ser_num": "F001",
      "ser_corr": 5,
      "doc_cod": "01"
    }
  ]
}
```

### 2. ✅ ACTUALIZADO: Crear Venta
```http
POST /api/v1/ventas
```

**Body (Antes):**
```json
{
  "correlativo": "V-2025-001",  // ❌ Manual
  "doc_id": 1,
  // ...
}
```

**Body (Ahora):**
```json
{
  "serie_id": 1,  // ✅ Automático
  "doc_id": 1,
  // ...
}
```

**Response:**
```json
{
  "data": {
    "venta_id": 1,
    "serie_id": 1,
    "numero_completo": "F001-00000005",  // ✅ Generado automáticamente
    "serie": {
      "ser_id": 1,
      "ser_num": "F001",
      "doc_cod": "01"
    }
  }
}
```

### 3. ✅ ACTUALIZADO: Buscar Ventas
```http
POST /api/v1/ventas/search
```

**Response (DTO actualizado):**
```json
{
  "data": {
    "items": [
      {
        "venta_id": 1,
        "numero_completo": "F001-00000005",  // ✅ NUEVO
        "serie": {                           // ✅ NUEVO
          "ser_id": 1,
          "ser_num": "F001"
        },
        "fechaEmision": "2025-12-07",
        // ...
      }
    ]
  }
}
```

---

## 🛡️ Validaciones Agregadas

### 1. Serie Existe y Está Activa
```php
$serie = Serie::where('ser_id', $data['serie_id'])
    ->where('est', true)
    ->first();

if (!$serie) {
    throw new \Exception('Serie no encontrada o inactiva');
}
```

### 2. Serie Corresponde al Tipo de Documento
```php
if ($serie->doc_cod !== $documento->doc_cod) {
    throw new \Exception('La serie no corresponde al tipo de documento');
}
```

### 3. Lock de Concurrencia
```php
->lockForUpdate()  // Bloquea la fila durante la transacción
```

---

## 📊 Impacto en el Sistema

### Base de Datos:
- ✅ 1 migración ejecutada
- ✅ 2 campos modificados en tabla `ventas`
- ✅ 1 foreign key agregada

### Código:
- ✅ 1 modelo actualizado
- ✅ 1 controlador actualizado
- ✅ 1 archivo de rutas actualizado
- ✅ 1 método nuevo agregado
- ✅ Documentación Swagger regenerada

### Endpoints:
- ✅ 1 endpoint nuevo
- ✅ 2 endpoints actualizados
- ✅ Total: 6 endpoints funcionales

---

## 📝 Archivos Modificados

### Migraciones:
1. ✅ `database/migrations/2025_12_07_214158_update_ventas_table_add_serie_id.php`

### Modelos:
1. ✅ `app/Models/Venta.php`

### Controladores:
1. ✅ `app/Http/Controllers/VentaController.php`

### Rutas:
1. ✅ `routes/v1/ventas.php`

### Documentación:
1. ✅ `SISTEMA_SERIES_VENTAS.md` (nuevo)
2. ✅ `CAMBIOS_SISTEMA_SERIES.md` (este archivo)

---

## 🧪 Testing

### Casos de Prueba:

#### 1. Obtener Series
```bash
curl -X GET http://localhost/api/v1/ventas/series/1 \
  -H "Authorization: Bearer {token}"
```

#### 2. Crear Venta con Serie
```bash
curl -X POST http://localhost/api/v1/ventas \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "serie_id": 1,
    "doc_id": 1,
    "suc_id": 1,
    "vendedor_id": 1,
    "detalles": [...]
  }'
```

#### 3. Verificar Correlativo Generado
```bash
curl -X GET http://localhost/api/v1/ventas/1 \
  -H "Authorization: Bearer {token}"
```

---

## ⚠️ Consideraciones de Migración

### Si tienes ventas existentes:

#### Opción 1: Migración Manual
```sql
-- Crear series para documentos existentes
INSERT INTO series (doc_cod, ser_num, ser_corr) VALUES ('01', 'F001', 1);

-- Actualizar ventas existentes
UPDATE ventas 
SET serie_id = 1, 
    numero_completo = CONCAT('F001-', LPAD(venta_id, 8, '0'))
WHERE doc_id = 1 AND serie_id IS NULL;
```

#### Opción 2: Script de Migración
Crear un comando Artisan para migrar datos automáticamente.

---

## 🚀 Próximos Pasos Recomendados

1. ✅ Actualizar frontend para usar el nuevo sistema
2. ✅ Crear endpoint para gestión de series (CRUD)
3. ✅ Implementar reportes por serie
4. ✅ Agregar validación de límite de correlativo
5. ✅ Implementar reinicio de correlativo anual (opcional)

---

## 📞 Soporte

Para más información:
- Ver: `SISTEMA_SERIES_VENTAS.md` - Documentación completa
- Swagger: `/api/documentation` - Documentación interactiva
- Modelo: `app/Models/Serie.php`
- Controlador: `app/Http/Controllers/VentaController.php`

---

**Fecha de implementación:** 7 de Diciembre, 2025
**Versión:** 2.0.0
**Estado:** ✅ Completado y Funcional
**Breaking Changes:** ⚠️ Sí - El campo `correlativo` fue reemplazado por `serie_id` y `numero_completo`
