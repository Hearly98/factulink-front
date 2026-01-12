export const ProductoSucursalStructure = [
    {
        label: 'Producto',
        formControlName: 'prod_id',
        type: 'select',
        dataSource: 'productos',
        col: '12',
    },
    {
        label: 'Sucursal',
        formControlName: 'suc_id',
        type: 'select',
        dataSource: 'sucursales',
        col: '12',
    },
    {
        label: 'Stock',
        formControlName: 'prod_stock',
        type: 'number',
        col: '12',
    },
    {
        label: 'Precio Compra Base',
        formControlName: 'prod_pcompra_base',
        type: 'number',
        col: '6',
    },
    {
        label: 'Precio Venta Base',
        formControlName: 'prod_pventa_base',
        type: 'number',
        col: '6',
    },
];
