export function privateTransportStructure() {
  return [
    {
      title: 'Datos del Transportista',
      controls: [
        {
          label: 'Tipo Documento',
          formControlName: 'transportista_tipo_doc',
          type: 'select',
          col: 3,
          options: [
            { label: 'DNI', value: 'DNI' },
            { label: 'RUC', value: 'RUC' },
            { label: 'Carnet', value: 'CARNET' },
          ],
        },
        {
          label: 'Nro. Documento',
          formControlName: 'transportista_nro_doc',
          type: 'text',
          col: 3,
          placeholder: '12345678',
        },
        {
          label: 'Licencia',
          formControlName: 'transportista_licencia',
          type: 'text',
          col: 3,
          placeholder: 'Licencia de conducir',
        },
        {
          label: 'Placa',
          formControlName: 'transportista_placa',
          type: 'text',
          col: 3,
          placeholder: 'ABC-123',
        },
        {
          label: 'Vehículo',
          formControlName: 'transportista_vehiculo',
          type: 'text',
          col: 3,
          placeholder: 'MAZDA ...',
        },
        {
          label: 'Dirección',
          formControlName: 'transportista_direccion',
          type: 'text',
          col: 3,
          placeholder: 'Av. Ejemplo',
        },
      ],
    },
  ];
}
