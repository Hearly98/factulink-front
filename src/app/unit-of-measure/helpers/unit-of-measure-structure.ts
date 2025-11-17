export const unitOfMeasureStructure = [
  {
    label: 'Nombre',
    formControlName: 'und_nom',
    type: 'text',
    col: '12',
  },
  {
    label: 'Sucursal',
    formControlName: 'suc_id',
    type: 'select',
    col: '12',
    dataSource: 'sucursales',
  },
];
