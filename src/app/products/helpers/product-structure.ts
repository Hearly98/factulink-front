export const productStructure = [
  {
    label: 'Nombre',
    formControlName: 'prod_nom',
    type: 'text',
    col: '12',
  },
  {
    label: 'Descripción',
    formControlName: 'prod_descrip',
    type: 'text',
    col: '12',
  },
  {
    label: 'Código Interno',
    formControlName: 'prod_cod_interno',
    type: 'text',
    col: '6',
  },
  {
    label: 'Código Fabricante',
    formControlName: 'cod_fabricante',
    type: 'text',
    col: '6',
  },
  {
    label: 'Categoría',
    formControlName: 'cat_id',
    type: 'select',
    col: '6',
    dataSource: 'categorias',
  },
  {
    label: 'Unidad',
    formControlName: 'und_id',
    type: 'select',
    col: '6',
    dataSource: 'unidades',
  },
  {
    label: 'Imagen',
    formControlName: 'prod_img',
    type: 'file',
    col: '12',
  },
];
