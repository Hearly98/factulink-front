# Guia de Integración: Producto-Sucursal

Esta guía detalla el uso del módulo de asignación de productos a sucursales, permitiendo gestionar el stock y los precios específicos por cada sede.

## Contexto
El modelo `ProductoSucursal` actúa como una tabla intermedia (pivot) entre `Productos` y `Sucursales`. 
A diferencia de otros módulos, este es **idempotente** en su creación: si intentas "crear" una asignación que ya existe (mismo `prod_id` y `suc_id`), el sistema simplemente actualizará los valores existentes.

---

## Endpoints Principales

### 1. Búsqueda Paginada con Filtros
**Endpoint:** `POST /v1/productos-sucursal/search`

Permite listar las asignaciones con soporte para filtros y ordenamiento.

**Cuerpo de la petición (Ejemplo):**
```json
{
    "filter": {
        "suc_id": 2,
        "est": true
    },
    "page": {
        "page": 1,
        "pageSize": 10
    },
    "sort": [
        { "property": "prod_stock", "direction": "desc" }
    ]
}
```

---

### 2. Crear o Actualizar (Upsert)
**Endpoint:** `POST /v1/productos-sucursal`

Este endpoint es el más utilizado. Si el producto ya está asignado a la sucursal, actualiza el stock y los precios. Si no, crea la relación.

**Cuerpo de la petición:**
```json
{
    "prod_id": 1,
    "suc_id": 2,
    "prod_stock": 150,
    "prod_pcompra_base": 3.50,
    "prod_pventa_base": 4.20
}
```
*   **prod_id**: ID del producto (requerido).
*   **suc_id**: ID de la sucursal (requerido).
*   **prod_stock**: Cantidad disponible (opcional, default 0).
*   **prod_pcompra_base**: Precio de costo (opcional).
*   **prod_pventa_base**: Precio de venta (opcional).

---

### 3. Actualización Específica
**Endpoint:** `PUT /v1/productos-sucursal/{prodsuc_id}`

Se usa para actualizar un registro específico conociendo su ID primario (`prodsuc_id`).

**Cuerpo de la petición:**
```json
{
    "prod_stock": 120,
    "prod_pventa_base": 4.50,
    "est": true
}
```

---

### 4. Desactivar Asignación
**Endpoint:** `DELETE /v1/productos-sucursal/{prodsuc_id}`

Realiza un borrado lógico (cambia `est` a `false`). No elimina físicamente el registro para mantener integridad histórica.

---

## Tip de Integración para el Frontend
Cuando el usuario selecciona una sucursal en el panel administrativo, puedes usar el endpoint de `search` filtrando por `suc_id` para obtener rápidamente el inventario disponible en esa sede.

Si necesitas cargar el detalle de un producto incluyendo sus precios en una sucursal específica, recuerda que el endpoint de `GET /v1/productos/{prod_id}` también devuelve la relación de sucursales si se solicita.
