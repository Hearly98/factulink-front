import { FilterForm } from '../core/types/filter-form';

export const mapParams = (value: Partial<FilterForm>): Record<string, any> => {
  const params: Record<string, any> = {};
  if (value.marca_nom) params['marca_nom'] = value.marca_nom;
  if (value.marca_codigo) params['marca_codigo'] = value.marca_codigo;
  if (value.est !== null) params['est'] = value.est;
  return params;
};
