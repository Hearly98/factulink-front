import { SelectOption } from '@shared/types';

export interface QuotationStructureControl {
  label: string;
  formControlName: string;
  type: string;
  col: number;
  placeholder?: string;
  options?: SelectOption[];
  bindLabel?: string;
  bindValue?: string;
  serviceFnName?: string;
  showControlName?: string;
}

export interface QuotationStructureSection {
  title: string;
  controls: QuotationStructureControl[];
  position?: 'top' | 'bottom';
}

export function quotationStructure(
  currencies: SelectOption[] = [],
  sucursales: SelectOption[] = []
): QuotationStructureSection[] {
  return [
    {
      title: 'Información de la Cotización',
      controls: [
        {
          label: 'Fecha de Emisión',
          formControlName: 'fecha_emision',
          type: 'date',
          col: 4,
        },
        {
          label: 'Sucursal',
          formControlName: 'suc_id',
          type: 'select',
          col: 4,
          options: sucursales,
        },
        {
          label: 'Moneda',
          formControlName: 'mon_id',
          type: 'select',
          col: 4,
          options: currencies,
          showControlName: 'mostrar_moneda',
        },
      ],
    },
    {
      title: 'Información del Cliente',
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
          label: 'Documento',
          formControlName: 'cli_documento',
          type: 'text',
          col: 4,
          placeholder: 'RUC/DNI',
        },
        {
          label: 'Dirección',
          formControlName: 'cli_direcc',
          type: 'text',
          col: 4,
          placeholder: 'Dirección del cliente',
        },
        {
          label: 'Correo',
          formControlName: 'correo_contacto',
          type: 'email',
          col: 3,
          placeholder: 'correo@ejemplo.com',
        },
        {
          label: 'Teléfono',
          formControlName: 'telefono_contacto',
          type: 'text',
          col: 3,
          placeholder: 'Teléfono',
        },
        {
          label: 'Contacto',
          formControlName: 'nombre_contacto',
          type: 'text',
          col: 3,
          placeholder: 'Nombre Contacto',
        },
        {
          label: 'Area',
          formControlName: 'area_contacto',
          type: 'text',
          col: 3,
          placeholder: 'Area',
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
          label: '¿Incluye I.G.V?',
          formControlName: 'igv_requerido',
          type: 'select',
          col: 2,
          options: [
            { label: 'Sí', value: true },
            { label: 'No', value: false },
          ],
        },
        {
          label: '¿Mostrar Total?',
          formControlName: 'mostrar_total',
          type: 'select',
          col: 2,
          options: [
            { label: 'Sí', value: true },
            { label: 'No', value: false },
          ],
        },
      ],
    },
    {
      title: 'Detalle Adicional',
      position: 'bottom',
      controls: [
        {
          label: 'Tipo de Pago',
          formControlName: 'tipo_pago_id',
          type: 'select',
          col: 6,
          placeholder: 'Tipo de Pago',
          showControlName: 'mostrar_tipo_pago',
        },
        {
          label: 'Fecha Valido Hasta',
          formControlName: 'fecha_valido_hasta',
          type: 'date',
          col: 6,
          placeholder: 'Fecha Valido Hasta',
          showControlName: 'mostrar_fecha_valido_hasta',
        },
        {
          label: 'Forma de Pago',
          formControlName: 'forma_pago',
          type: 'text',
          col: 6,
          placeholder: 'Forma de Pago',
          showControlName: 'mostrar_forma_pago',
        },
        {
          label: 'Plazo de Entrega',
          formControlName: 'plazo_entrega',
          type: 'text',
          col: 6,
          placeholder: 'Plazo de Entrega',
          showControlName: 'mostrar_plazo_entrega',
        },
        {
          label: 'Lugar de Entrega',
          formControlName: 'lugar_entrega',
          type: 'text',
          col: 6,
          placeholder: 'Lugar de Entrega',
          showControlName: 'mostrar_lugar_entrega',
        },
        {
          label: 'Garantía',
          formControlName: 'garantia',
          type: 'text',
          col: 6,
          placeholder: 'Garantía',
          showControlName: 'mostrar_garantia',
        },
        {
          label: 'Consideraciones',
          formControlName: 'consideraciones',
          type: 'text',
          col: 6,
          placeholder: 'Consideraciones',
          showControlName: 'mostrar_consideraciones',
        },
        {
          label: 'Servicio Complementario',
          formControlName: 'servicio_complementario',
          type: 'text',
          col: 6,
          placeholder: 'Servicio Complementario',
          showControlName: 'mostrar_servicio_complementario',
        },
        {
          label: 'Observaciones',
          formControlName: 'observaciones',
          type: 'textarea',
          col: 12,
          placeholder: 'Observaciones',
        }
      ],
    }
  ];
}
