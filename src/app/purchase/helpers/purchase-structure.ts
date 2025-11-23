export const purchaseStructure = () => {
  return [
    {
      title: 'Tipo de Pago',
      controls: [
        {
          label: 'Documento',
          type: 'select',
          col: '4',
          formControlName: 'doc_id',
          options: [],
        },
        {
          label: 'Tipo de Pago',
          type: 'select',
          col: '4',
          formControlName: 'pago_id',
          options: [],
        },
        {
          label: 'Moneda',
          type: 'select',
          col: '4',
          formControlName: 'mon_id',
          options: [],
        },
      ],
    },
    {
      title: 'Datos de Proveedor',
      controls: [
        {
          label: 'Proveedor',
          col: '4',
          type: 'select',
          formControlName: 'prov_id',
          options: [],
        },
        {
          label: 'RUC',
          col: '4',
          type: 'text',
          formControlName: 'prov_ruc',
        },
        {
          label: 'Dirección',
          col: '4',
          type: 'text',
          formControlName: 'prov_direcc',
        },

        {
          label: 'Correo',
          col: '6',
          type: 'text',
          formControlName: 'prov_correo',
        },
        {
          label: 'Teléfono',
          col: '6',
          type: 'text',
          formControlName: 'prov_telf',
        },
      ],
    },
    {
      title: 'Agregar Producto',
      controls: [
        {
          label: 'Producto',
          col: '12',
          type: 'select',
          formControlName: 'product_id',
          options: [],
        },
      ],
    },
  ];
};
