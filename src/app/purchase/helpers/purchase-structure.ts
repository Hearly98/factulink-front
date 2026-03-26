import { SelectOption } from '@shared/types';
import { NewPurchaseComponent } from '../pages/new-purchase/new-purchase.component';
import { PurchaseForm } from '../core/purchase.form';

export type Control<SM extends Record<string, any>> =
  | SelectControl
  | SearchSelectControl<SM>
  | TextControl
  | CheckboxControl;

interface ControlBase {
  label: string;
  type: string;
  col: string;
  formControlName: keyof PurchaseForm;
}

interface SelectControl extends ControlBase {
  type: 'select';
  options: SelectOption[];
}

export interface SearchSelectControl<SM extends Record<string, any>> extends ControlBase {
  type: 'search-select';
  bindLabel: string;
  bindValue: string;
  serviceFnName: keyof SM;
}

interface TextControl extends ControlBase {
  type: 'text' | 'date';
  placeholder: string;
}

interface CheckboxControl extends ControlBase {
  type: 'checkbox';
}

export interface PurchaseStructure<SM extends Record<string, any>> {
  title: string;
  controls: Control<SM>[];
}
export const purchaseStructure = (
  CurrencySelectOptions: SelectOption[] = [],
  PaymentTypeOptions: SelectOption[] = [],
  DocumentsOptions: SelectOption[] = [],
  DocumentTypesOptions: SelectOption[] = [],
  SucursalOptions: SelectOption[] = [],
  AlmacenOptions: SelectOption[] = []
): PurchaseStructure<NewPurchaseComponent['serviceMap']>[] => {
  return [
    {
      title: 'Tipo de Pago',
      controls: [
        {
          label: 'Tipo Documento',
          type: 'select',
          col: '4',
          formControlName: 'doc_id',
          options: DocumentsOptions,
        },
        {
          label: 'Tipo de Pago',
          type: 'select',
          col: '4',
          formControlName: 'mp_id',
          options: PaymentTypeOptions,
        },
        {
          label: 'Moneda',
          type: 'select',
          col: '4',
          formControlName: 'mon_id',
          options: CurrencySelectOptions,
        },
        {
          label: 'Fecha Emisión',
          type: 'date',
          col: '6',
          formControlName: 'fechaEmision',
          placeholder: ""
        },
        {
          label: 'Documento',
          type: 'text',
          col: '6',
          formControlName: 'numero',
          placeholder: "Número de Documento"
        },
      ],
    },
    {
      title: 'Datos de Proveedor',
      controls: [
        {
          label: 'Proveedor',
          col: '4',
          type: 'search-select',
          formControlName: 'prov_id',
          bindLabel: 'prov_nom',
          bindValue: 'prov_id',
          serviceFnName: 'providerSearch',
        },
        {
          label: 'Tipo Documento',
          col: '4',
          type: 'select',
          formControlName: 'tip_id',
          options: DocumentTypesOptions,
        },
        {
          label: 'Documento',
          col: '4',
          type: 'text',
          placeholder: 'Documento',
          formControlName: 'prov_documento',
        },
        {
          label: 'Dirección',
          col: '5',
          placeholder: 'Dirección',
          type: 'text',
          formControlName: 'prov_direcc',
        },
        {
          label: 'Correo',
          col: '4',
          type: 'text',
          placeholder: 'Correo electrónico',
          formControlName: 'prov_correo',
        },
        {
          label: 'Teléfono',
          col: '3',
          type: 'text',
          placeholder: 'Teléfono',
          formControlName: 'prov_telf',
        },
      ],
    },
    {
      title: 'Agregar Producto',
      controls: [
        {
          label: 'Sucursal',
          col: '4',
          type: 'select',
          formControlName: 'suc_id',
          options: SucursalOptions,
        },
        {
          label: 'Almacén',
          col: '4',
          type: 'select',
          formControlName: 'alm_id',
          options: AlmacenOptions,
        },
        {
          label: 'Producto',
          col: '4',
          type: 'search-select',
          formControlName: 'prod_id',
          bindLabel: 'label',
          bindValue: 'prod_id',
          serviceFnName: 'productSearch',
        },
        {
          label: 'Afecta Stock',
          col: '12',
          type: 'checkbox',
          formControlName: 'afecta_stock',
        },
      ],
    },
  ];
};
