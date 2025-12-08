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
}

export interface QuotationStructureSection {
  title: string;
  controls: QuotationStructureControl[];
}

export function quotationStructure(
  series: SelectOption[] = [],
  currencies: SelectOption[] = [],
  sucursales: SelectOption[] = []
): QuotationStructureSection[] {
  return [
    {
      title: 'Información de la Cotización',
      controls: [
        {
          label: 'Serie',
          formControlName: 'serie_id',
          type: 'select',
          col: 3,
          options: series,
        },
        {
          label: 'Sucursal',
          formControlName: 'suc_id',
          type: 'select',
          col: 3,
          options: sucursales,
        },
        {
          label: 'Moneda',
          formControlName: 'mon_id',
          type: 'select',
          col: 3,
          options: currencies,
        },
        {
          label: 'Fecha de Emisión',
          formControlName: 'fechaEmision',
          type: 'date',
          col: 3,
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
          col: 12,
          bindLabel: 'cli_nom',
          bindValue: 'cli_id',
          serviceFnName: 'customerSearch',
        },
        {
          label: 'Documento',
          formControlName: 'cli_documento',
          type: 'text',
          col: 3,
          placeholder: 'RUC/DNI',
        },
        {
          label: 'Tipo Documento',
          formControlName: 'tip_id',
          type: 'text',
          col: 3,
          placeholder: 'Tipo',
        },
        {
          label: 'Dirección',
          formControlName: 'cli_direcc',
          type: 'text',
          col: 6,
          placeholder: 'Dirección del cliente',
        },
        {
          label: 'Correo',
          formControlName: 'cli_correo',
          type: 'email',
          col: 6,
          placeholder: 'correo@ejemplo.com',
        },
        {
          label: 'Teléfono',
          formControlName: 'cli_telf',
          type: 'text',
          col: 6,
          placeholder: 'Teléfono',
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
          col: 8,
          bindLabel: 'prod_nom',
          bindValue: 'prod_id',
          serviceFnName: 'productSearch',
        },
      ],
    },
  ];
}
