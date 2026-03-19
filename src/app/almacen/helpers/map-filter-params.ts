import { FilterForm } from '../core/types';

export function mapParams(formValue: Partial<FilterForm>) {
    const params: any = {};
    if (formValue.nombre) params.nombre = formValue.nombre;
    if (formValue.suc_id) params.suc_id = formValue.suc_id;
    if (formValue.activo !== null) params.est = formValue.activo;
    return params;
}
