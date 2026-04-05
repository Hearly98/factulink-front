export function publicTransportStructure() {
  return [
    {
      title: 'Empresa de Transporte',
      controls: [
        {
          label: 'Tipo Documento',
          formControlName: 'empresa_transporte_tipo_doc',
          type: 'select',
          col: 3,
          options: [
            { label: 'RUC', value: 'RUC' },
            { label: 'DNI', value: 'DNI' },
          ],
        },
        {
          label: 'Nro. Documento',
          formControlName: 'empresa_transporte_nro_doc',
          type: 'text',
          col: 3,
          placeholder: '20123456789',
        },
        {
          label: 'Razón Social',
          formControlName: 'empresa_transporte_razon_social',
          type: 'text',
          col: 6,
          placeholder: 'Nombre de la empresa',
        },
      ],
    },
  ];
}
