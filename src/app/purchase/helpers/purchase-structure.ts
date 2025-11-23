import { SelectOption } from '@shared/types';
import { NewPurchaseComponent } from '../pages/new-purchase/new-purchase.component';
import { PurchaseForm } from '../core/purchase.form';

export type Control<SM extends Record<string, any>> =
  | SelectControl
  | SearchSelectControl<SM>
  | TextControl;

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
  type: 'text';
}

export interface PurchaseStructure<SM extends Record<string, any>> {
  title: string;
  controls: Control<SM>[];
}
export const purchaseStructure = (
  CurrencySelectOptions: SelectOption[] = [],
  PaymentTypeOptions: SelectOption[] = [],
  DocumentsOptions: SelectOption[] = [],
  DocumentTypesOptions: SelectOption[] = []
): PurchaseStructure<NewPurchaseComponent['serviceMap']>[] => {
  return [
    {
      title: 'Tipo de Pago',
      controls: [
        {
          label: 'Documento',
          type: 'select',
          col: '4',
          formControlName: 'doc_id',
          options: DocumentsOptions,
        },
        {
          label: 'Tipo de Pago',
          type: 'select',
          col: '4',
          formControlName: 'pago_id',
          options: PaymentTypeOptions,
        },
        {
          label: 'Moneda',
          type: 'select',
          col: '4',
          formControlName: 'mon_id',
          options: CurrencySelectOptions,
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
          formControlName: 'prov_documento',
        },
        {
          label: 'Dirección',
          col: '5',
          type: 'text',
          formControlName: 'prov_direcc',
        },
        {
          label: 'Correo',
          col: '4',
          type: 'text',
          formControlName: 'prov_correo',
        },
        {
          label: 'Teléfono',
          col: '3',
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
          type: 'search-select',
          formControlName: 'product_id',
          bindLabel: 'prod_nom',
          bindValue: 'prod_id',
          serviceFnName: 'productSearch',
        },
      ],
    },
  ];
};
