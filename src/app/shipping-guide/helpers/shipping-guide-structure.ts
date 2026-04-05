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
  col: number;
  controls: ShippingGuideStructureControl[];
}

export function shippingGuideStructure(
  sucursales: SelectOption[] = [],
  clientes: SelectOption[] = [],
): ShippingGuideStructureSection[] {
  return [
    {
      title: 'Datos de la Guía',
      col: 12,
      controls: [
        {
          label: 'Fecha de Emisión',
          formControlName: 'fecha_emision',
          type: 'date',
          col: 3,
        },
        {
          label: 'Cotización',
          formControlName: 'cot_id',
          type: 'search-select',
          col: 3,
          bindLabel: 'numero_completo',
          bindValue: 'cot_id',
          serviceFnName: 'cotizacionSearch',
        },
        {
          label: 'Nro. O.C.',
          formControlName: 'nro_oc',
          type: 'text',
          col: 3,
          placeholder: 'OC-001',
        },
        {
          label: 'Nro. Factura',
          formControlName: 'nro_factura',
          type: 'text',
          col: 3,
          placeholder: 'F001-001',
        },
        {
          label: 'Observaciones',
          formControlName: 'observaciones',
          type: 'textarea',
          col: 12,
          placeholder: 'Observaciones adicionales',
        },
      ],
    },
    {
      title: 'Punto de Partida',
      col: 6,
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
      col: 6,
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
      col: 12,
      controls: [
        {
          label: 'Cliente',
          formControlName: 'cli_id',
          type: 'search-select',
          col: 4,
          bindLabel: 'cli_nom',
          bindValue: 'cli_id',
          serviceFnName: 'customerSearch',
        },
        {
          label: 'Número de documento',
          formControlName: 'doc_cliente',
          type: 'text',
          col: 4,
          placeholder: 'Ej: 1234556',
        },
        {
          label: 'Dirección',
          formControlName: 'direccion_cliente',
          type: 'text',
          col: 4,
          placeholder: 'Av. Las Americas 123',
        },
      ],
    },
    {
      title: 'Motivo de Traslado',
      col: 12,
      controls: [
        {
          label: 'Fecha Traslado',
          formControlName: 'fecha_inicio_traslado',
          type: 'date',
          col: 4,
        },
        {
          label: 'Tipo Traslado',
          formControlName: 'tipo_traslado',
          type: 'select',
          col: 4,
          options: [
            { label: 'Privado', value: 'PRIVADO' },
            { label: 'Público', value: 'PUBLICO' },
          ],
        },
        {
          label: 'Motivo',
          formControlName: 'motivo_traslado',
          type: 'select',
          col: 4,
          options: [
            { label: 'Venta', value: 'Venta' },
            { label: 'Compra', value: 'Compra' },
            {
              label: 'Traslado entre establecimientos de la misma empresa',
              value: 'Traslado entre establecimientos de la misma empresa',
            },
            { label: 'Importación', value: 'Importación' },
            { label: 'Exportación', value: 'Exportación' },
            {
              label: 'Venta sujeta a confirmación del comprador',
              value: 'Venta sujeta a confirmación del comprador',
            },
            { label: 'Traslado emisor itinerante CP', value: 'Traslado emisor itinerante CP' },
            { label: 'Traslado a zona primaria', value: 'Traslado a zona primaria' },
            { label: 'Otros', value: 'otros' },
          ],
        },
      ],
    },
    {
      title: 'Agregar Producto',
      col: 12,
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
  ];
}
