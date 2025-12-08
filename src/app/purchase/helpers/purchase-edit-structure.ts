export const purchaseEditStructure = [
  {
    label: 'Fecha',
    formControlName: 'com_fecha',
    type: 'date',
    col: 6,
  },
  {
    label: 'Estado',
    formControlName: 'com_estado',
    type: 'select',
    col: 6,
    options: [
      { value: 'pendiente', label: 'Pendiente' },
      { value: 'cancelado', label: 'Cancelado' },
      { value: 'eliminado', label: 'Eliminado' },
    ],
  },
  {
    label: 'Proveedor',
    formControlName: 'prv_id',
    type: 'select',
    col: 6,
  },
  {
    label: 'Sucursal',
    formControlName: 'suc_id',
    type: 'select',
    col: 6,
  },
  {
    label: 'Total',
    formControlName: 'com_total',
    type: 'number',
    col: 12,
  },
  {
    label: 'Observaciones',
    formControlName: 'com_observaciones',
    type: 'textarea',
    col: 12,
  },
];
