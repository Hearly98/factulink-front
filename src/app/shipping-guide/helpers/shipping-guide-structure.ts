import { SelectOption } from '@shared/types';

export interface ShippingGuideStructureControl {
  label: string;
  formControlName: string;
  type: string;
  col: number;
  placeholder?: string;
  options?: SelectOption[];
  bindLabel?: string;
  bindValue?: string;
  serviceFnName?: string;
}

export interface ShippingGuideStructureSection {
  title: string;
  controls: ShippingGuideStructureControl[];
}

export function shippingGuideStructure(
  series: SelectOption[] = [],
  sucursales: SelectOption[] = [],
  clientes: SelectOption[] = []
): ShippingGuideStructureSection[] {
  return [
    {
      title: 'Datos de la Guía',
      controls: [
        {
          label: 'Serie',
          formControlName: 'serie_id',
          type: 'select',
          col: 4,
          options: series,
        },
        {
          label: 'Fecha de Emisión',
          formControlName: 'fecha_emision',
          type: 'date',
          col: 4,
        },
        {
          label: 'Fecha Inicio Traslado',
          formControlName: 'fecha_inicio_traslado',
          type: 'date',
          col: 4,
        },
      ],
    },
    {
      title: 'Punto de Partida',
      controls: [
        {
          label: 'Ubigeo Partida',
          formControlName: 'partida_ubigeo',
          type: 'text',
          col: 4,
          placeholder: '150101',
        },
        {
          label: 'Dirección Partida',
          formControlName: 'partida_direccion',
          type: 'text',
          col: 8,
          placeholder: 'Av. Principal 123',
        },
      ],
    },
    {
      title: 'Punto de Destino',
      controls: [
        {
          label: 'Ubigeo Destino',
          formControlName: 'destino_ubigeo',
          type: 'text',
          col: 4,
          placeholder: '150102',
        },
        {
          label: 'Dirección Destino',
          formControlName: 'destino_direccion',
          type: 'text',
          col: 8,
          placeholder: 'Av. Secundaria 456',
        },
      ],
    },
    {
      title: 'Datos del Cliente',
      controls: [
        {
          label: 'Cliente',
          formControlName: 'cli_id',
          type: 'search-select',
          col: 6,
          bindLabel: 'cli_nom',
          bindValue: 'cli_id',
          serviceFnName: 'customerSearch',
        },
        {
          label: 'Tipo Traslado',
          formControlName: 'tipo_traslado',
          type: 'select',
          col: 6,
          options: [
            { label: 'Privado', value: 'PRIVADO' },
            { label: 'Público', value: 'PUBLICO' },
          ],
        },
      ],
    },
    {
      title: 'Motivo de Traslado',
      controls: [
        {
          label: 'Motivo',
          formControlName: 'motivo_traslado',
          type: 'text',
          col: 12,
          placeholder: 'Venta, Compra, Devolución, etc.',
        },
      ],
    },
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
      ],
    },
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
    {
      title: 'Referencias',
      controls: [
        {
          label: 'Nro. Cotización',
          formControlName: 'nro_cotizacion',
          type: 'text',
          col: 4,
          placeholder: 'COT-001',
        },
        {
          label: 'Nro. O.C.',
          formControlName: 'nro_oc',
          type: 'text',
          col: 4,
          placeholder: 'OC-001',
        },
        {
          label: 'Nro. Factura',
          formControlName: 'nro_factura',
          type: 'text',
          col: 4,
          placeholder: 'F001-001',
        },
      ],
    },
    {
      title: 'Agregar Producto',
      controls: [
        {
          label: 'Producto',
          formControlName: 'prod_id',
          type: 'search-select',
          col: 6,
          bindLabel: 'prod_nom',
          bindValue: 'prod_id',
          serviceFnName: 'productSearch',
        },
        {
          label: 'Cantidad',
          formControlName: 'cantidad',
          type: 'number',
          col: 3,
          placeholder: 'Cantidad',
        },
      ],
    },
    {
      title: 'Observaciones',
      controls: [
        {
          label: 'Observaciones',
          formControlName: 'observaciones',
          type: 'textarea',
          col: 12,
          placeholder: 'Observaciones adicionales',
        },
      ],
    },
  ];
}
