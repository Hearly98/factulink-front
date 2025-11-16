export const productStructure = [
  {
    label: 'Nombre',
    formControlName: 'prod_nom',
    type: 'text',
    col: '6',
  },
  {
    label: 'Descripción',
    formControlName: 'prod_descrip',
    type: 'text',
    col: '6',
  },
  {
    label: 'Sucursal',
    formControlName: 'suc_id',
    type: 'select',
    col: '4',
    dataSource: 'sucursales'
  },
  {
    label: 'Categoría',
    formControlName: 'cat_id',
    type: 'select',
    col: '4',
    dataSource: 'categorias'
  },
  {
    label: 'Unidad',
    formControlName: 'und_id',
    type: 'select',
    col: '4',
    dataSource: 'unidades'
  },
  {
    label: 'Moneda',
    formControlName: 'mon_id',
    type: 'select',
    col: '4',
    dataSource: 'monedas'
  },
  {
    label: 'Precio Compra',
    formControlName: 'prod_pcompra',
    type: 'number',
    col: '4',
  },
  {
    label: 'Precio Venta',
    formControlName: 'prod_pventa',
    type: 'number',
    col: '4',
  },
  {
    label: 'Stock',
    formControlName: 'prod_stock',
    type: 'number',
    col: '4',
  },
  {
    label: 'Fecha Vencimiento',
    formControlName: 'prod_fechaven',
    type: 'date',
    col: '6',
  },
  {
    label: 'Imagen',
    formControlName: 'prod_img',
    type: 'text',
    col: '6',
  },
];

