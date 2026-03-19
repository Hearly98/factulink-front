export interface StructureItem {
  label: string;
  formControlName: string;
  type: string;
  col: string;
  placeholder?: string;
  dataSource?: string;
}

export const brandStructure: StructureItem[] = [
  { label: 'Código', formControlName: 'marca_codigo', type: 'text', col: '6', placeholder: 'Ej: MRC-001' },
  { label: 'Nombre', formControlName: 'marca_nom', type: 'text', col: '6', placeholder: 'Ej: Samsung' },
];
