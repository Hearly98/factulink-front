# Ejemplos de Respuestas API - Sistema de Permisos

## 📋 Endpoint: GET /api/permissions/menu

### Usuario: Administrador (Acceso Total)

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
      "id": 2,
      "code": "menu.compras",
      "name": "Compras",
      "menuUri": "/compras",
      "menuIcon": "shopping-bag",
      "sortOrder": 2,
      "actionCode": "compras.list",
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
    },
    {
      "id": 6,
      "code": "menu.clientes",
      "name": "Clientes",
      "menuUri": "/clientes",
      "menuIcon": "users",
      "sortOrder": 4,
      "actionCode": "clientes.list",
      "children": []
    },
    {
      "id": 7,
      "code": "menu.reportes",
      "name": "Reportes",
      "menuUri": null,
      "menuIcon": "bar-chart",
      "sortOrder": 5,
      "actionCode": null,
      "children": [
        {
          "id": 8,
          "code": "menu.reportes.ventas",
          "name": "Ventas",
          "menuUri": "/reportes/ventas",
          "menuIcon": null,
          "sortOrder": 1,
          "actionCode": "reportes.ventas",
          "children": []
        },
        {
          "id": 9,
          "code": "menu.reportes.compras",
          "name": "Compras",
          "menuUri": "/reportes/compras",
          "menuIcon": null,
          "sortOrder": 2,
          "actionCode": "reportes.compras",
          "children": []
        },
        {
          "id": 10,
          "code": "menu.reportes.inventario",
          "name": "Inventario",
          "menuUri": "/reportes/inventario",
          "menuIcon": null,
          "sortOrder": 3,
          "actionCode": "reportes.inventario",
          "children": []
        }
      ]
    },
    {
      "id": 11,
      "code": "menu.configuracion",
      "name": "Configuración",
      "menuUri": null,
      "menuIcon": "settings",
      "sortOrder": 6,
      "actionCode": null,
      "children": [
        {
          "id": 12,
          "code": "menu.configuracion.usuarios",
          "name": "Usuarios",
          "menuUri": "/configuracion/usuarios",
          "menuIcon": null,
          "sortOrder": 1,
          "actionCode": "usuarios.list",
          "children": []
        },
        {
          "id": 13,
          "code": "menu.configuracion.roles",
          "name": "Roles y Permisos",
          "menuUri": "/configuracion/roles",
          "menuIcon": null,
          "sortOrder": 2,
          "actionCode": "roles.manage",
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

---

### Usuario: Vendedor (Acceso Limitado)

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
    },
    {
      "id": 6,
      "code": "menu.clientes",
      "name": "Clientes",
      "menuUri": "/clientes",
      "menuIcon": "users",
      "sortOrder": 4,
      "actionCode": "clientes.list",
      "children": []
    },
    {
      "id": 7,
      "code": "menu.reportes",
      "name": "Reportes",
      "menuUri": null,
      "menuIcon": "bar-chart",
      "sortOrder": 5,
      "actionCode": null,
      "children": [
        {
          "id": 8,
          "code": "menu.reportes.ventas",
          "name": "Ventas",
          "menuUri": "/reportes/ventas",
          "menuIcon": null,
          "sortOrder": 1,
          "actionCode": "reportes.ventas",
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

---

### Usuario: Almacenero (Acceso Limitado)

```json
{
  "data": [
    {
      "id": 2,
      "code": "menu.compras",
      "name": "Compras",
      "menuUri": "/compras",
      "menuIcon": "shopping-bag",
      "sortOrder": 2,
      "actionCode": "compras.list",
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
    },
    {
      "id": 7,
      "code": "menu.reportes",
      "name": "Reportes",
      "menuUri": null,
      "menuIcon": "bar-chart",
      "sortOrder": 5,
      "actionCode": null,
      "children": [
        {
          "id": 10,
          "code": "menu.reportes.inventario",
          "name": "Inventario",
          "menuUri": "/reportes/inventario",
          "menuIcon": null,
          "sortOrder": 3,
          "actionCode": "reportes.inventario",
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

---

## 📋 Endpoint: GET /api/permissions/user-permissions

### Usuario: Administrador

```json
{
  "data": [
    "ventas.list",
    "ventas.create",
    "ventas.view",
    "ventas.update",
    "ventas.delete",
    "ventas.pdf",
    "compras.list",
    "compras.create",
    "compras.view",
    "compras.update",
    "compras.delete",
    "productos.list",
    "productos.create",
    "productos.update",
    "productos.delete",
    "stock.view",
    "stock.adjust",
    "clientes.list",
    "clientes.create",
    "clientes.update",
    "clientes.delete",
    "reportes.ventas",
    "reportes.compras",
    "reportes.inventario",
    "reportes.financiero",
    "usuarios.list",
    "usuarios.create",
    "usuarios.update",
    "usuarios.delete",
    "roles.manage",
    "permisos.manage"
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

---

### Usuario: Vendedor

```json
{
  "data": [
    "ventas.list",
    "ventas.create",
    "ventas.view",
    "ventas.pdf",
    "clientes.list",
    "clientes.create",
    "clientes.update",
    "productos.list",
    "stock.view",
    "reportes.ventas"
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

---

### Usuario: Almacenero

```json
{
  "data": [
    "productos.list",
    "productos.create",
    "productos.update",
    "stock.view",
    "stock.adjust",
    "compras.list",
    "compras.view",
    "reportes.inventario"
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

---

## 📋 Endpoint: POST /api/permissions/check

### Request

```json
{
  "action_code": "ventas.create"
}
```

### Response: Usuario CON permiso

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

### Response: Usuario SIN permiso

```json
{
  "data": {
    "has_permission": false,
    "action_code": "ventas.create"
  },
  "isValid": true,
  "messages": [
    {
      "key": null,
      "message": "Usuario no tiene permiso",
      "messageType": 0
    }
  ],
  "errors": []
}
```

---

## 📋 Endpoint: GET /api/permissions/modules

### Response

```json
{
  "data": [
    {
      "mod_id": 1,
      "mod_code": "ventas",
      "mod_nom": "Ventas",
      "mod_desc": "Gestión de ventas y facturación",
      "mod_icon": "shopping-cart",
      "mod_order": 1,
      "est": true,
      "created_at": "2026-02-02T10:00:00.000000Z",
      "updated_at": "2026-02-02T10:00:00.000000Z",
      "actions": [
        {
          "act_id": 1,
          "mod_id": 1,
          "parent_act_id": null,
          "act_code": "ventas.list",
          "act_nom": "Listar Ventas",
          "act_desc": null,
          "est": true,
          "created_at": "2026-02-02T10:00:00.000000Z",
          "updated_at": "2026-02-02T10:00:00.000000Z"
        },
        {
          "act_id": 2,
          "mod_id": 1,
          "parent_act_id": null,
          "act_code": "ventas.create",
          "act_nom": "Crear Venta",
          "act_desc": null,
          "est": true,
          "created_at": "2026-02-02T10:00:00.000000Z",
          "updated_at": "2026-02-02T10:00:00.000000Z"
        },
        {
          "act_id": 3,
          "mod_id": 1,
          "parent_act_id": null,
          "act_code": "ventas.view",
          "act_nom": "Ver Detalle Venta",
          "act_desc": null,
          "est": true,
          "created_at": "2026-02-02T10:00:00.000000Z",
          "updated_at": "2026-02-02T10:00:00.000000Z"
        }
      ]
    },
    {
      "mod_id": 2,
      "mod_code": "compras",
      "mod_nom": "Compras",
      "mod_desc": "Gestión de compras y proveedores",
      "mod_icon": "shopping-bag",
      "mod_order": 2,
      "est": true,
      "created_at": "2026-02-02T10:00:00.000000Z",
      "updated_at": "2026-02-02T10:00:00.000000Z",
      "actions": [
        {
          "act_id": 7,
          "mod_id": 2,
          "parent_act_id": null,
          "act_code": "compras.list",
          "act_nom": "Listar Compras",
          "act_desc": null,
          "est": true,
          "created_at": "2026-02-02T10:00:00.000000Z",
          "updated_at": "2026-02-02T10:00:00.000000Z"
        }
      ]
    }
  ],
  "isValid": true,
  "messages": [
    {
      "key": null,
      "message": "Módulos obtenidos exitosamente",
      "messageType": 0
    }
  ],
  "errors": []
}
```

---

## 📋 Endpoint: GET /api/permissions/roles/{roleId}

### Request: GET /api/permissions/roles/2

### Response

```json
{
  "data": {
    "role": {
      "rol_id": 2,
      "rol_nom": "Vendedor",
      "est": true,
      "created_at": "2026-02-02T10:00:00.000000Z",
      "updated_at": "2026-02-02T10:00:00.000000Z"
    },
    "permissions": {
      "Ventas": [
        {
          "act_id": 1,
          "act_code": "ventas.list",
          "act_nom": "Listar Ventas"
        },
        {
          "act_id": 2,
          "act_code": "ventas.create",
          "act_nom": "Crear Venta"
        },
        {
          "act_id": 3,
          "act_code": "ventas.view",
          "act_nom": "Ver Detalle Venta"
        },
        {
          "act_id": 6,
          "act_code": "ventas.pdf",
          "act_nom": "Generar PDF Venta"
        }
      ],
      "Clientes": [
        {
          "act_id": 18,
          "act_code": "clientes.list",
          "act_nom": "Listar Clientes"
        },
        {
          "act_id": 19,
          "act_code": "clientes.create",
          "act_nom": "Crear Cliente"
        },
        {
          "act_id": 20,
          "act_code": "clientes.update",
          "act_nom": "Actualizar Cliente"
        }
      ],
      "Inventario": [
        {
          "act_id": 12,
          "act_code": "productos.list",
          "act_nom": "Listar Productos"
        },
        {
          "act_id": 16,
          "act_code": "stock.view",
          "act_nom": "Ver Stock"
        }
      ],
      "Reportes": [
        {
          "act_id": 22,
          "act_code": "reportes.ventas",
          "act_nom": "Reporte de Ventas"
        }
      ]
    }
  },
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

---

## 📋 Endpoint: POST /api/permissions/roles/{roleId}/assign

### Request: POST /api/permissions/roles/2/assign

```json
{
  "action_ids": [1, 2, 3, 6, 12, 16, 18, 19, 20, 22]
}
```

### Response

```json
{
  "data": null,
  "isValid": true,
  "messages": [
    {
      "key": null,
      "message": "Permisos asignados exitosamente",
      "messageType": 0
    }
  ],
  "errors": []
}
```

---

## ⚠️ Respuestas de Error

### Usuario no autenticado

```json
{
  "data": null,
  "isValid": false,
  "messages": [
    {
      "key": null,
      "message": "Usuario no autenticado",
      "messageType": 3
    }
  ],
  "errors": []
}
```

### Rol no encontrado

```json
{
  "data": null,
  "isValid": false,
  "messages": [
    {
      "key": null,
      "message": "Rol no encontrado",
      "messageType": 3
    }
  ],
  "errors": []
}
```

### Validación fallida

```json
{
  "data": null,
  "isValid": false,
  "messages": [
    {
      "key": null,
      "message": "The action_ids field is required.",
      "messageType": 3
    }
  ],
  "errors": []
}
```

---

## 🎯 Notas Importantes

1. **Formato de Respuesta**: Todas las respuestas siguen el formato estándar con `data`, `isValid`, `messages` y `errors`

2. **Estructura Jerárquica**: El menú viene con `children` anidados, listo para renderizar en Angular

3. **Códigos de Acción**: Los `actionCode` son los que se usan en `ngx-permissions` para verificar permisos

4. **Ordenamiento**: Los menús vienen ordenados por `sortOrder` desde el backend

5. **Filtrado Automático**: El backend solo devuelve menús y permisos que el usuario tiene asignados

6. **Autenticación**: Todos los endpoints requieren token Bearer excepto los de consulta pública de módulos y roles
